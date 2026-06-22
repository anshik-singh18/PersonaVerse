const mongoose = require("mongoose");

// ============================================================
//  models/Chat.js
//
//  Yeh model ek poori chat conversation store karta hai.
//
//  Structure:
//    - Ek Chat document = ek user + ek persona ke beech ki poori conversation
//    - Messages array mein saare messages hote hain
//    - Har message mein role (user/ai) aur text hota hai
//
//  Example:
//    {
//      userId:    "abc123",
//      personaId: "xyz789",
//      messages: [
//        { role: "user", text: "What do you think about AI?" },
//        { role: "ai",   text: "AI is the future of humanity..." },
//      ]
//    }
// ============================================================

// ── Single message ka structure ──
const messageSchema = new mongoose.Schema(
  {
    // "user" = banda jo chat kar raha hai
    // "ai"   = persona ka AI jawab
    role: {
      type: String,
      enum: ["user", "ai"],   // sirf yeh do values allowed hain
      required: true,
    },

    // Message ka text content
    text: {
      type: String,
      required: true,
    },
  },
  {
    // Har message ka apna timestamp hoga
    timestamps: true,
  }
);

// ── Poori conversation ka structure ──
const chatSchema = new mongoose.Schema(
  {
    // Yeh chat kis user ka hai
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Yeh chat kis persona ke saath hai
    personaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Persona",
      required: true,
    },

    // Saare messages is array mein store honge
    // Naya message aane par yeh array update hoga
    messages: [messageSchema],

    // Last message ka preview — Dashboard mein dikhane ke liye
    // e.g. "You: What do you think about AI?"
    lastMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);