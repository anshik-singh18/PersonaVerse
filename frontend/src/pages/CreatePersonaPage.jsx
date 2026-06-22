import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPersonaAPI } from "../api";
import "./CreatePersonaPage.css";

// ============================================================
//  PERSONAVERSE — CreatePersonaPage.jsx
//  Real API call: createPersonaAPI() → MongoDB mein save hoga
// ============================================================

const AVATAR_OPTIONS = [
  "🧑‍💼", "👩‍💼", "🧑‍🔬", "👩‍🔬", "🧑‍🎨", "👩‍🎨",
  "🧑‍⚖️", "👩‍⚖️", "🧑‍💻", "👩‍💻", "🧑‍🏫", "👩‍🏫",
  "🧙", "🕵️", "🧑‍🚀", "👩‍🚀", "🦸", "🦸‍♀️",
];

const TRAIT_OPTIONS = [
  "Analytical", "Creative", "Empathetic", "Ambitious",
  "Introverted", "Extroverted", "Optimistic", "Pessimistic",
  "Logical", "Emotional", "Stubborn", "Flexible",
  "Visionary", "Practical", "Humorous", "Serious",
  "Curious", "Cautious",
];

const COMM_STYLES = [
  "Direct and blunt", "Diplomatic and careful",
  "Storytelling and metaphors", "Data and facts driven",
  "Inspirational and motivating", "Sarcastic and witty",
  "Calm and measured",
];

const POLITICAL_VIEWS = [
  "Far Left", "Left / Liberal", "Centre / Moderate",
  "Right / Conservative", "Far Right",
  "Apolitical", "Libertarian", "Other / Complex",
];

const VOCAB_LEVELS = [
  "Simple — everyday language",
  "Moderate — educated but accessible",
  "Advanced — complex vocabulary",
  "Technical — field-specific jargon",
  "Archaic — old-fashioned formal",
];

const TONE_OPTIONS = [
  "Formal", "Casual", "Inspirational", "Philosophical",
  "Aggressive / Blunt", "Humorous", "Academic", "Poetic",
];

export default function CreatePersonaPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "", avatar: "🧑‍💼", dateOfBirth: "",
    nationality: "", profession: "", shortBio: "",
    traits: [], commStyle: "", strengths: "", weaknesses: "",
    politicalView: "", religiousView: "", lifePhilosophy: "",
    opinionsOnTech: "", opinionsOnSociety: "",
    earlyLife: "", keyEvents: "", education: "", achievements: "",
    vocabLevel: "", tone: "", famousQuotes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function toggleTrait(trait) {
    setFormData((prev) => ({
      ...prev,
      traits: prev.traits.includes(trait)
        ? prev.traits.filter((t) => t !== trait)
        : [...prev.traits, trait],
    }));
  }

  // ── FORM SUBMIT — Real API call ──
  async function handleSubmit() {
    if (!formData.fullName || !formData.profession) {
      setError("Full Name and Profession are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // famousQuotes string ko array mein convert karo
      // User ne ek per line likha hai
      const quotesArray = formData.famousQuotes
        .split("\n")
        .map((q) => q.trim())
        .filter((q) => q.length > 0);

      // API call — MongoDB mein save hoga
      const data = await createPersonaAPI({
        ...formData,
        famousQuotes: quotesArray,
      });

      if (data.persona) {
        // Success — dashboard pe jao
        navigate("/dashboard");
      } else {
        setError(data.message || "Could not create persona.");
      }

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* NAVBAR */}
      <nav className="cp-navbar">
        <div className="cp-navbar__logo">PersonaVerse</div>
        <button className="cp-navbar__back" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </nav>

      <div className="cp-page">
        {/* Page heading */}
        <div className="cp-page__header">
          <div className="cp-page__tag">New Persona</div>
          <h1 className="cp-page__title">Create an Admin Profile</h1>
          <p className="cp-page__subtitle">
            Fill in as much detail as possible. The more the AI knows about this person —
            their beliefs, speech style, and background — the more accurately it will
            respond from their perspective.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            backgroundColor: "rgba(192,57,43,0.09)", color: "#c0392b",
            padding: "12px 16px", borderRadius: "10px",
            fontSize: "13px", marginBottom: "20px",
            border: "1px solid rgba(192,57,43,0.20)",
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* SECTION 1 — BASIC INFO */}
        <div className="form-section">
          <div className="form-section__title">🧑 Basic Information</div>
          <div className="form-section__desc">Who is this person? Start with the fundamentals.</div>
          <div className="form-section__divider"></div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-field__label">Full Name <span className="form-field__required">*</span></label>
              <input className="form-input" type="text" placeholder="e.g. Elon Musk"
                value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-field__label">Date of Birth</label>
              <input className="form-input" type="date"
                value={formData.dateOfBirth} onChange={(e) => handleChange("dateOfBirth", e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-field__label">Nationality</label>
              <input className="form-input" type="text" placeholder="e.g. South African-American"
                value={formData.nationality} onChange={(e) => handleChange("nationality", e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-field__label">Profession / Role <span className="form-field__required">*</span></label>
              <input className="form-input" type="text" placeholder="e.g. Entrepreneur, Physicist"
                value={formData.profession} onChange={(e) => handleChange("profession", e.target.value)} />
            </div>
          </div>

          <div className="form-row form-row--full">
            <div className="form-field">
              <label className="form-field__label">Short Bio <span className="form-field__required">*</span></label>
              <div className="form-field__hint">2–3 sentences describing who this person is.</div>
              <textarea className="form-textarea"
                placeholder="e.g. Elon Musk is a tech entrepreneur known for founding Tesla and SpaceX..."
                value={formData.shortBio} onChange={(e) => handleChange("shortBio", e.target.value)} />
              <div className="form-field__count">{formData.shortBio.length} characters</div>
            </div>
          </div>

          <div className="form-row form-row--full">
            <div className="form-field">
              <label className="form-field__label">Choose Avatar</label>
              <div className="form-field__hint">Pick an emoji that best represents this person.</div>
              <div className="avatar-picker">
                {AVATAR_OPTIONS.map((emoji) => (
                  <div key={emoji}
                    className={`avatar-picker__option ${formData.avatar === emoji ? "selected" : ""}`}
                    onClick={() => handleChange("avatar", emoji)}>
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2 — PERSONALITY */}
        <div className="form-section">
          <div className="form-section__title">🧠 Personality</div>
          <div className="form-section__desc">Describe how this person thinks and behaves.</div>
          <div className="form-section__divider"></div>

          <div className="form-row form-row--full">
            <div className="form-field">
              <label className="form-field__label">Core Personality Traits</label>
              <div className="form-field__hint">Select all that apply.</div>
              <div className="traits-grid">
                {TRAIT_OPTIONS.map((trait) => (
                  <div key={trait}
                    className={`trait-checkbox ${formData.traits.includes(trait) ? "selected" : ""}`}
                    onClick={() => toggleTrait(trait)}>
                    <div className="trait-checkbox__dot"></div>
                    {trait}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-row form-row--full">
            <div className="form-field">
              <label className="form-field__label">Communication Style</label>
              <select className="form-select" value={formData.commStyle}
                onChange={(e) => handleChange("commStyle", e.target.value)}>
                <option value="">-- Select a style --</option>
                {COMM_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-field__label">Key Strengths</label>
              <textarea className="form-textarea" placeholder="e.g. Long-term visionary thinking..."
                value={formData.strengths} onChange={(e) => handleChange("strengths", e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-field__label">Known Weaknesses</label>
              <textarea className="form-textarea" placeholder="e.g. Overconfidence..."
                value={formData.weaknesses} onChange={(e) => handleChange("weaknesses", e.target.value)} />
            </div>
          </div>
        </div>

        {/* SECTION 3 — BELIEFS */}
        <div className="form-section">
          <div className="form-section__title">🌍 Beliefs & Worldview</div>
          <div className="form-section__desc">Most important — AI uses this to answer from their perspective.</div>
          <div className="form-section__divider"></div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-field__label">Political View</label>
              <select className="form-select" value={formData.politicalView}
                onChange={(e) => handleChange("politicalView", e.target.value)}>
                <option value="">-- Select --</option>
                {POLITICAL_VIEWS.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="form-field__label">Religious / Spiritual View</label>
              <input className="form-input" type="text" placeholder="e.g. Agnostic, Muslim..."
                value={formData.religiousView} onChange={(e) => handleChange("religiousView", e.target.value)} />
            </div>
          </div>

          <div className="form-row form-row--full">
            <div className="form-field">
              <label className="form-field__label">Core Life Philosophy</label>
              <textarea className="form-textarea form-textarea--tall"
                placeholder="What does this person fundamentally believe about life?"
                value={formData.lifePhilosophy} onChange={(e) => handleChange("lifePhilosophy", e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-field__label">Opinion on Technology</label>
              <textarea className="form-textarea" placeholder="What do they think about AI, progress?"
                value={formData.opinionsOnTech} onChange={(e) => handleChange("opinionsOnTech", e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-field__label">Opinion on Society</label>
              <textarea className="form-textarea" placeholder="What do they think about people, culture?"
                value={formData.opinionsOnSociety} onChange={(e) => handleChange("opinionsOnSociety", e.target.value)} />
            </div>
          </div>
        </div>

        {/* SECTION 4 — BACKGROUND */}
        <div className="form-section">
          <div className="form-section__title">📖 Background & History</div>
          <div className="form-section__desc">A person's past shapes how they speak and think.</div>
          <div className="form-section__divider"></div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-field__label">Early Life / Childhood</label>
              <textarea className="form-textarea" placeholder="Where did they grow up?"
                value={formData.earlyLife} onChange={(e) => handleChange("earlyLife", e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-field__label">Education</label>
              <textarea className="form-textarea" placeholder="Schools, degrees..."
                value={formData.education} onChange={(e) => handleChange("education", e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-field__label">Key Life Events</label>
              <textarea className="form-textarea" placeholder="Turning points in their life..."
                value={formData.keyEvents} onChange={(e) => handleChange("keyEvents", e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-field__label">Major Achievements</label>
              <textarea className="form-textarea" placeholder="What are they most known for?"
                value={formData.achievements} onChange={(e) => handleChange("achievements", e.target.value)} />
            </div>
          </div>
        </div>

        {/* SECTION 5 — SPEECH STYLE */}
        <div className="form-section">
          <div className="form-section__title">🗣️ Speech & Expression Style</div>
          <div className="form-section__desc">How does this person actually speak?</div>
          <div className="form-section__divider"></div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-field__label">Vocabulary Level</label>
              <select className="form-select" value={formData.vocabLevel}
                onChange={(e) => handleChange("vocabLevel", e.target.value)}>
                <option value="">-- Select --</option>
                {VOCAB_LEVELS.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="form-field__label">Overall Tone</label>
              <select className="form-select" value={formData.tone}
                onChange={(e) => handleChange("tone", e.target.value)}>
                <option value="">-- Select --</option>
                {TONE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row form-row--full">
            <div className="form-field">
              <label className="form-field__label">Famous Quotes / Catchphrases</label>
              <div className="form-field__hint">One quote per line.</div>
              <textarea className="form-textarea form-textarea--tall"
                placeholder={"e.g.\nWhen something is important enough, you do it.\nFailure is an option here."}
                value={formData.famousQuotes} onChange={(e) => handleChange("famousQuotes", e.target.value)} />
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="cp-submit-row">
          <button className="cp-cancel-btn" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
          <button
            className="cp-submit-btn"
            onClick={handleSubmit}
            disabled={loading || !formData.fullName || !formData.profession}
          >
            {loading ? "Saving..." : "Save Persona →"}
          </button>
        </div>

      </div>
    </div>
  );
}