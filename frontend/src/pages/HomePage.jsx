import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

// ============================================================
//  PERSONAVERSE — HomePage.jsx
//  useNavigate — React Router ka hook hai
//  navigate("/dashboard") → dashboard page pe le jaata hai
// ============================================================

const NAV_LINKS = ["Features", "How It Works", "About"];

const FEATURE_CARDS = [
  {
    icon: "🧑‍💼",
    title: "Add Admin Profiles",
    desc: "Store detailed profiles of any real or fictional person — their name, profession, personality, beliefs, and background. Create as many as you need.",
    link: "Create a profile →",
  },
  {
    icon: "💬",
    title: "Chat with Them",
    desc: "Select any stored admin profile and start a live chat. The AI responds from their point of view — fully matching their personality and beliefs.",
    link: "Start a chat →",
  },
  {
    icon: "🧠",
    title: "Understand Their Perspective",
    desc: "Ask the same question to different personas and compare their answers. Great for research, decision-making, and empathy building.",
    link: "Explore perspectives →",
  },
  {
    icon: "📁",
    title: "Manage Your Profiles",
    desc: "View all your saved admin profiles in one place. Edit details, update personality traits, or delete profiles you no longer need.",
    link: "View profiles →",
  },
  {
    icon: "📊",
    title: "Chat History",
    desc: "Every conversation is saved automatically. Go back to any old chat to review responses or continue the conversation where you left off.",
    link: "View history →",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    desc: "Your profiles and chats are tied only to your account. No one else can access your data — complete privacy and security guaranteed.",
    link: "Learn more →",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    num: "1",
    title: "Build an Admin Profile",
    desc: "Enter the person's name, profession, personality traits, beliefs, and any background details you want the AI to know.",
  },
  {
    num: "2",
    title: "Start a Conversation",
    desc: "Select the profile and type your question. The AI steps into that persona and responds just like that person would.",
  },
  {
    num: "3",
    title: "Gain Real Insights",
    desc: "Understand how different people think. Compare perspectives across multiple profiles on any topic you care about.",
  },
];

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // useNavigate — page change karne ke liye
  const navigate = useNavigate();

  return (
    <div className="page">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar__logo">PersonaVerse</div>

        <div className="navbar__links">
          {NAV_LINKS.map((link) => (
            <span key={link} className="navbar__link">{link}</span>
          ))}
          {/* Login → dashboard pe le jaayega (baad mein login page pe jaayega) */}
          <button className="navbar__btn" onClick={() => navigate("/auth")}>
            Login
          </button>
        </div>

        <button
          className="navbar__hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`navbar__mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <span key={link} className="navbar__link">{link}</span>
        ))}
        <button className="navbar__btn" onClick={() => navigate("/auth")}>
          Login
        </button>
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__left">
          <div className="hero__tag">AI-Powered Personas</div>
          <h1 className="hero__title">
            Look inside<br />
            anyone's mind.<br />
            On demand.
          </h1>
          <p className="hero__subtitle">
            PersonaVerse lets you build detailed digital profiles of any person —
            real or fictional — and then have a live conversation with them.
            The AI responds from their exact point of view, every single time.
          </p>
          {/* Get Started → dashboard pe le jaata hai */}
          <button className="hero__btn" onClick={() => navigate("/dashboard")}>
            Get Started →
          </button>
        </div>

        <div className="hero__avatar">
          <div className="hero__avatar-emoji">🧑‍🎨</div>
          <div className="hero__avatar-label">Your Persona</div>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="section">
        <div className="section__header">
          <div className="section__tag">Dashboard Features</div>
          <h2 className="section__title">Everything in one place</h2>
          <p className="section__desc">
            Store admin profiles, chat with them, and understand their perspectives —
            all of these features are available right in your dashboard.
          </p>
        </div>

        <div className="cards-grid">
          {FEATURE_CARDS.map((card, index) => (
            <div
              key={index}
              className="card"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ opacity: hoveredCard === index ? 1 : 0.88 }}
            >
              <div className="card__icon">{card.icon}</div>
              <div className="card__title">{card.title}</div>
              <p className="card__desc">{card.desc}</p>
              <span className="card__link">{card.link}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section section--tinted">
        <div className="section__header">
          <div className="section__tag">Simple Process</div>
          <h2 className="section__title">How does it work?</h2>
          <p className="section__desc">
            Build a persona, ask your question, and get a response
            from their exact point of view — in just 3 steps.
          </p>
        </div>

        <div className="steps-row">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div key={index} style={{ display: "contents" }}>
              <div className="step">
                <div className="step__circle">{step.num}</div>
                <div className="step__title">{step.title}</div>
                <p className="step__desc">{step.desc}</p>
              </div>
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="step__arrow">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer__top">
          <div>
            <div className="footer__logo">PersonaVerse</div>
            <div className="footer__tagline">Look inside anyone's mind. On demand.</div>
          </div>
          <div className="footer__links">
            <span className="footer__link">Features</span>
            <span className="footer__link">Privacy Policy</span>
            <span className="footer__link">Terms of Service</span>
            <span className="footer__link">Contact Us</span>
          </div>
        </div>
        <div className="footer__bottom">
          © 2026 PersonaVerse. All rights reserved.
        </div>
      </footer>

    </div>
  );
}