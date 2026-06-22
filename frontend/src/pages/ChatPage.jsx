import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPersonaAPI, getChatAPI, sendMessageAPI } from "../api";
import "./ChatPage.css";

// ============================================================
//  PERSONAVERSE — ChatPage.jsx
//
//  Real API calls:
//    - getPersonaAPI()   → MongoDB se persona details lo
//    - getChatAPI()      → Purani chat history lo
//    - sendMessageAPI()  → Message bhejo, Gemini reply lo, save karo
// ============================================================

function getCurrentTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPage() {
  const navigate   = useNavigate();
  const { id }     = useParams(); // URL se persona id

  const [persona, setPersona]   = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // ── Page load par persona aur chat history fetch karo ──
  useEffect(() => {
    fetchPersonaAndHistory();
  }, [id]);

  // ── Auto scroll to bottom ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function fetchPersonaAndHistory() {
    setLoading(true);
    try {
      // Persona details lo
      const personaData = await getPersonaAPI(id);
      if (!personaData.persona) {
        setError("Persona not found.");
        return;
      }
      setPersona(personaData.persona);

      // Purani chat history lo
      const chatData = await getChatAPI(id);
      if (chatData.messages && chatData.messages.length > 0) {
        // Purane messages format mein convert karo
        const formattedMessages = chatData.messages.map((msg, index) => ({
          id: index,
          role: msg.role,
          text: msg.text,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit", minute: "2-digit"
          }),
        }));
        setMessages(formattedMessages);
      } else {
        // Pehli baar — welcome message dikhao
        setMessages([{
          id: 1,
          role: "ai",
          text: `I'm ${personaData.persona.fullName}. Ask me anything — about my work, my beliefs, my life.`,
          time: getCurrentTime(),
        }]);
      }

    } catch (err) {
      setError("Could not load chat. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── MESSAGE SEND ──
  async function handleSend() {
    const text = inputText.trim();
    if (!text || isTyping) return;

    setError("");

    // User message UI mein add karo
    const userMsg = { id: Date.now(), role: "user", text, time: getCurrentTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    if (inputRef.current) inputRef.current.style.height = "auto";

    setIsTyping(true);

    try {
      // Backend ko message bhejo — Gemini se reply aayega
      const data = await sendMessageAPI(id, text);

      if (data.reply) {
        const aiMsg = {
          id: Date.now() + 1,
          role: "ai",
          text: data.reply,
          time: getCurrentTime(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setError(data.message || "Could not get a response.");
      }

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInputChange(e) {
    setInputText(e.target.value);
    const ta = inputRef.current;
    if (ta) { ta.style.height = "auto"; ta.style.height = ta.scrollHeight + "px"; }
  }

  // ── LOADING SCREEN ──
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#7a6050", fontFamily: "Poppins, sans-serif" }}>
        Loading chat...
      </div>
    );
  }

  // ── ERROR SCREEN ──
  if (!persona) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", color: "#7a6050", fontFamily: "Poppins, sans-serif", gap: "16px" }}>
        <div>⚠️ {error || "Persona not found."}</div>
        <button onClick={() => navigate("/dashboard")} style={{ backgroundColor: "#8b5e3c", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "30px", cursor: "pointer" }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="chat-page">

      {/* NAVBAR */}
      <nav className="chat-navbar">
        <div className="chat-navbar__persona">
          <div className="chat-navbar__avatar">{persona.avatar}</div>
          <div>
            <div className="chat-navbar__name">{persona.fullName}</div>
            <div className="chat-navbar__status">Active now</div>
          </div>
        </div>
        <button className="chat-navbar__back" onClick={() => navigate("/dashboard")}>
          ← <span>Back to Dashboard</span>
        </button>
      </nav>

      {/* CHAT BODY */}
      <div className="chat-body">

        {/* Messages column */}
        <div className="chat-messages-col">
          <div className="chat-messages">
            <div className="chat-date-separator">Today</div>

            {messages.map((msg) => (
              <div key={msg.id}
                className={`chat-message ${msg.role === "user" ? "chat-message--user" : "chat-message--ai"}`}>
                <div className="chat-message__avatar">
                  {msg.role === "ai" ? persona.avatar : "👤"}
                </div>
                <div>
                  <div className="chat-message__bubble">{msg.text}</div>
                  <div className="chat-message__time">{msg.time}</div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="chat-typing">
                <div className="chat-message__avatar">{persona.avatar}</div>
                <div className="chat-typing__bubble">
                  <div className="chat-typing__dot"></div>
                  <div className="chat-typing__dot"></div>
                  <div className="chat-typing__dot"></div>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div style={{ textAlign: "center", fontSize: "13px", color: "#c0392b", padding: "8px 16px", backgroundColor: "rgba(192,57,43,0.08)", borderRadius: "8px", margin: "0 auto" }}>
                ⚠️ {error}
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          {/* Input bar */}
          <div className="chat-input-bar">
            <textarea ref={inputRef} className="chat-input-bar__input"
              placeholder={`Message ${persona.fullName}...`}
              value={inputText} onChange={handleInputChange}
              onKeyDown={handleKeyDown} rows={1} />
            <button className="chat-input-bar__send" onClick={handleSend}
              disabled={!inputText.trim() || isTyping}>
              ➤
            </button>
          </div>
        </div>

        {/* Right: Persona info panel */}
        <aside className="chat-info-panel">
          <div className="info-panel__avatar">{persona.avatar}</div>
          <div className="info-panel__name">{persona.fullName}</div>
          <div className="info-panel__profession">{persona.profession}</div>
          <div className="info-panel__divider"></div>

          {persona.nationality && (
            <div className="info-panel__row">
              <div className="info-panel__label">Nationality</div>
              <div className="info-panel__value">{persona.nationality}</div>
            </div>
          )}

          {persona.commStyle && (
            <div className="info-panel__row">
              <div className="info-panel__label">Communication Style</div>
              <div className="info-panel__value">{persona.commStyle}</div>
            </div>
          )}

          {persona.lifePhilosophy && (
            <div className="info-panel__row">
              <div className="info-panel__label">Core Philosophy</div>
              <div className="info-panel__value">{persona.lifePhilosophy}</div>
            </div>
          )}

          {persona.traits?.length > 0 && (
            <>
              <div className="info-panel__divider"></div>
              <div className="info-panel__row">
                <div className="info-panel__label">Personality Traits</div>
                <div className="info-panel__traits">
                  {persona.traits.map((trait) => (
                    <span key={trait} className="info-panel__trait">{trait}</span>
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}