const Chat    = require("../models/Chat");
const Persona = require("../models/Persona");

// ============================================================
//  controllers/chatController.js
//
//  3 functions:
//    1. sendMessage  → user ka message lo, Gemini se reply lo, save karo
//    2. getChat      → ek persona ke saath poori chat history lo
//    3. getAllChats   → user ki saari recent chats lo (dashboard ke liye)
// ============================================================


// ── Helper: Persona ki details se system prompt banao ──
// Yeh prompt Gemini ko batata hai ki wo kaun hai
const buildSystemPrompt = (persona) => {
  return `You are ${persona.fullName}. You are NOT an AI assistant. You ARE ${persona.fullName} — respond exactly as this person would in real life.

IDENTITY: ${persona.fullName}, ${persona.profession}, ${persona.nationality || ""}, born ${persona.dateOfBirth || ""}
PERSONALITY TRAITS: ${persona.traits?.join(", ") || ""}
COMMUNICATION STYLE: ${persona.commStyle || ""}
VOCABULARY: ${persona.vocabLevel || ""}
TONE: ${persona.tone || ""}
STRENGTHS: ${persona.strengths || ""}
WEAKNESSES: ${persona.weaknesses || ""}
LIFE PHILOSOPHY: ${persona.lifePhilosophy || ""}
OPINION ON TECHNOLOGY: ${persona.opinionsOnTech || ""}
OPINION ON SOCIETY: ${persona.opinionsOnSociety || ""}
BACKGROUND: ${persona.earlyLife || ""}
EDUCATION: ${persona.education || ""}
ACHIEVEMENTS: ${persona.achievements || ""}
FAMOUS QUOTES:
${persona.famousQuotes?.map((q) => `"${q}"`).join("\n") || ""}

RULES:
1. Always speak in first person as ${persona.fullName}. NEVER break character.
2. Never say you are an AI. You ARE ${persona.fullName}.
3. Match the exact tone and vocabulary described above.
4. Keep responses conversational and natural.`;
};


// ============================================================
//  SEND MESSAGE
//  POST /api/chat/send
//  Body: { personaId, message }
// ============================================================
const sendMessage = async (req, res) => {
  try {
    const { personaId, message } = req.body;

    if (!personaId || !message) {
      return res.status(400).json({ message: "personaId and message are required" });
    }

    // Persona ki details lo (AI ko context dene ke liye)
    const persona = await Persona.findById(personaId);
    if (!persona) {
      return res.status(404).json({ message: "Persona not found" });
    }

    // Is user ki is persona ke saath existing chat dhundho
    // Agar nahi hai toh nayi chat banao
    let chat = await Chat.findOne({
      userId:    req.user._id,
      personaId: personaId,
    });

    if (!chat) {
      // Pehli baar chat ho rahi hai — nayi chat document banao
      chat = await Chat.create({
        userId:    req.user._id,
        personaId: personaId,
        messages:  [],
      });
    }

    // User ka message chat mein add karo
    chat.messages.push({ role: "user", text: message });

    // ── GEMINI API CALL ──
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    // Gemini ke liye conversation history banao
    const contents = [
      // System prompt — persona ki identity
      {
        role: "user",
        parts: [{ text: buildSystemPrompt(persona) }],
      },
      {
        role: "model",
        parts: [{ text: `Understood. I am ${persona.fullName} and will respond fully in character.` }],
      },
      // Poori chat history bhejo — AI ko context rahega
      ...chat.messages.slice(0, -1).map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
      // Current user message
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    // Gemini API call karo
    console.log("Gemini URL:", GEMINI_URL);
    console.log("Gemini API Key:", process.env.GEMINI_API_KEY ? "Found" : "NOT FOUND");
    const geminiResponse = await fetch(GEMINI_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ contents }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.log("Gemini API Error:", JSON.stringify(errorData));
      throw new Error("Gemini API call failed");
    }

    const geminiData = await geminiResponse.json();

    // Gemini ka reply nikalo
    const aiReply = geminiData.candidates[0].content.parts[0].text;

    // AI ka reply bhi chat mein save karo
    chat.messages.push({ role: "ai", text: aiReply });

    // Dashboard ke liye last message preview update karo
    chat.lastMessage = `You: ${message}`;

    // Updated chat save karo
    await chat.save();

    // Frontend ko AI reply bhejo
    res.status(200).json({
      reply: aiReply,
      chatId: chat._id,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ============================================================
//  GET CHAT HISTORY
//  GET /api/chat/:personaId
//  Ek persona ke saath poori conversation lo
// ============================================================
const getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      userId:    req.user._id,
      personaId: req.params.personaId,
    });

    // Agar koi chat nahi toh empty array bhejo
    if (!chat) {
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json({ messages: chat.messages });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ============================================================
//  GET ALL CHATS (for dashboard recent chats)
//  GET /api/chat
//  User ki saari recent conversations lo
// ============================================================
const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .populate("personaId", "fullName avatar profession")  // persona details bhi lo
      .sort({ updatedAt: -1 })  // latest pehle
      .limit(10);               // sirf last 10 chats

    res.status(200).json({ chats });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { sendMessage, getChat, getAllChats };