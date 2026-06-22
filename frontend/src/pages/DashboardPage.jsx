import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPersonasAPI, getAllChatsAPI, deletePersonaAPI } from "../api";
import "./DashboardPage.css";

// ============================================================
//  PERSONAVERSE — DashboardPage.jsx
//
//  Real API calls:
//    - getPersonasAPI()  → MongoDB se real personas fetch
//    - getAllChatsAPI()  → Real recent chats fetch
//    - deletePersonaAPI() → Persona delete karo
//
//  localStorage se logged in user ka naam aata hai
// ============================================================

const SIDEBAR_ITEMS = [
  { icon: "📁", label: "My Profiles",  id: "profiles" },
  { icon: "💬", label: "Chat History", id: "chats"    },
  { icon: "⚙️", label: "Settings",     id: "settings" },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  // Sidebar active tab
  const [activeTab, setActiveTab] = useState("profiles");

  // Real data states
  const [personas, setPersonas]     = useState([]);
  const [recentChats, setRecentChats] = useState([]);

  // Loading states
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [loadingChats, setLoadingChats]       = useState(true);

  // Error state
  const [error, setError] = useState("");

  // localStorage se logged in user lo
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ── Page load hone par data fetch karo ──
  useEffect(() => {
    fetchPersonas();
    fetchRecentChats();
  }, []);

  // ── Personas fetch karo ──
  async function fetchPersonas() {
    setLoadingPersonas(true);
    try {
      const data = await getPersonasAPI();
      if (data.personas) {
        setPersonas(data.personas);
      }
    } catch (err) {
      setError("Could not load personas.");
    } finally {
      setLoadingPersonas(false);
    }
  }

  // ── Recent chats fetch karo ──
  async function fetchRecentChats() {
    setLoadingChats(true);
    try {
      const data = await getAllChatsAPI();
      if (data.chats) {
        setRecentChats(data.chats);
      }
    } catch (err) {
      console.error("Could not load chats.");
    } finally {
      setLoadingChats(false);
    }
  }

  // ── Persona delete karo ──
  async function handleDelete(personaId, e) {
    // Click event ko card tak jaane se roko
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this persona?")) return;

    try {
      await deletePersonaAPI(personaId);
      // Local state se bhi hata do — page reload nahi karni
      setPersonas((prev) => prev.filter((p) => p._id !== personaId));
    } catch (err) {
      setError("Could not delete persona.");
    }
  }

  // ── Logout ──
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  }

  return (
    <div>

      {/* NAVBAR */}
      <nav className="dash-navbar">
        <div className="dash-navbar__logo">PersonaVerse</div>
        <div className="dash-navbar__right">
          <div className="dash-navbar__user">
            <div className="dash-navbar__user-avatar">👤</div>
            {/* Real user name from localStorage */}
            <span>{user.name || "User"}</span>
          </div>
          <button className="dash-navbar__logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* LAYOUT */}
      <div className="dash-layout">

        {/* SIDEBAR */}
        <aside className="dash-sidebar">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar__item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="sidebar__item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="sidebar__divider"></div>
          <button className="sidebar__new-btn" onClick={() => navigate("/create")}>
            <span>＋</span> New Profile
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="dash-main">

          {/* Error banner */}
          {error && (
            <div style={{
              backgroundColor: "rgba(192,57,43,0.09)",
              color: "#c0392b",
              padding: "12px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              marginBottom: "16px",
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div>
              <div className="welcome-banner__title">
                Welcome back, {user.name || "User"} 👋
              </div>
              <div className="welcome-banner__subtitle">
                You have {personas.length} persona{personas.length !== 1 ? "s" : ""} saved.
                Pick one and start a conversation.
              </div>
            </div>
            <div className="welcome-banner__emoji">🌐</div>
          </div>

          {/* Quick Stats — real numbers */}
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-box__icon">📁</div>
              <div>
                <div className="stat-box__number">{personas.length}</div>
                <div className="stat-box__label">Saved Profiles</div>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-box__icon">💬</div>
              <div>
                <div className="stat-box__number">{recentChats.length}</div>
                <div className="stat-box__label">Total Chats</div>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-box__icon">🕐</div>
              <div>
                {/* Last chat ka time dikhao */}
                <div className="stat-box__number">
                  {recentChats.length > 0
                    ? new Date(recentChats[0].updatedAt).toLocaleDateString()
                    : "N/A"}
                </div>
                <div className="stat-box__label">Last Active</div>
              </div>
            </div>
          </div>

          {/* SAVED PERSONAS */}
          <div>
            <div className="content-section__header">
              <div>
                <div className="content-section__title">Saved Personas</div>
                <div className="content-section__tag">
                  {personas.length} profile{personas.length !== 1 ? "s" : ""} saved
                </div>
              </div>
              <button className="add-new-btn" onClick={() => navigate("/create")}>
                ＋ Add New Persona
              </button>
            </div>

            {/* Loading state */}
            {loadingPersonas ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#7a6050" }}>
                Loading personas...
              </div>
            ) : (
              <div className="personas-grid">
                {/* Real personas from MongoDB */}
                {personas.map((persona) => (
                  <div key={persona._id} className="persona-card">
                    <div className="persona-card__avatar">{persona.avatar}</div>
                    <div className="persona-card__name">{persona.fullName}</div>
                    <div className="persona-card__profession">{persona.profession}</div>
                    <p className="persona-card__detail">{persona.shortBio}</p>

                    {/* Chat button */}
                    <button
                      className="persona-card__chat-btn"
                      onClick={() => navigate(`/chat/${persona._id}`)}
                    >
                      💬 Chat with {persona.fullName.split(" ")[0]}
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDelete(persona._id, e)}
                      style={{
                        marginTop: "8px",
                        width: "100%",
                        padding: "7px",
                        backgroundColor: "transparent",
                        border: "1px solid rgba(192,57,43,0.30)",
                        color: "#c0392b",
                        borderRadius: "30px",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}

                {/* Add New empty card */}
                <div
                  className="persona-card persona-card--empty"
                  onClick={() => navigate("/create")}
                >
                  <div className="empty-plus">＋</div>
                  <div className="empty-text">Add New Persona</div>
                </div>
              </div>
            )}
          </div>

          {/* RECENT CHATS */}
          <div>
            <div className="content-section__header">
              <div>
                <div className="content-section__title">Recent Chats</div>
                <div className="content-section__tag">Your last conversations</div>
              </div>
            </div>

            {loadingChats ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#7a6050" }}>
                Loading chats...
              </div>
            ) : recentChats.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#7a6050", fontSize: "14px" }}>
                No chats yet — start a conversation with a persona!
              </div>
            ) : (
              <div className="chats-list">
                {recentChats.map((chat) => (
                  <div
                    key={chat._id}
                    className="chat-row"
                    onClick={() => navigate(`/chat/${chat.personaId._id}`)}
                  >
                    <div className="chat-row__avatar">
                      {chat.personaId?.avatar || "🧑‍💼"}
                    </div>
                    <div className="chat-row__info">
                      <div className="chat-row__name">
                        {chat.personaId?.fullName || "Unknown"}
                      </div>
                      <div className="chat-row__preview">
                        {chat.lastMessage || "Start a conversation..."}
                      </div>
                    </div>
                    <div className="chat-row__time">
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}