const mongoose = require("mongoose");

// ============================================================
//  models/Persona.js
//
//  Yeh model define karta hai ki ek Admin Persona
//  ka data MongoDB mein kis format mein save hoga.
//
//  Yeh exactly wahi data hai jo user CreatePersonaPage
//  form mein fill karta hai.
//
//  Har persona ek specific user se linked hota hai (userId)
//  Taaki har user sirf apne personas dekhe
// ============================================================

const personaSchema = new mongoose.Schema(
  {
    // Yeh persona kis user ka hai
    // User.js ke _id se link hoga
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── BASIC INFO ──────────────────────────────
    avatar: {
      type: String,
      default: "🧑‍💼",
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    dateOfBirth: {
      type: String,
      default: "",
    },

    nationality: {
      type: String,
      default: "",
    },

    profession: {
      type: String,
      required: [true, "Profession is required"],
      trim: true,
    },

    shortBio: {
      type: String,
      default: "",
    },

    // ── PERSONALITY ──────────────────────────────
    // Array of strings — e.g. ["Analytical", "Creative"]
    traits: {
      type: [String],
      default: [],
    },

    commStyle: {
      type: String,
      default: "",
    },

    strengths: {
      type: String,
      default: "",
    },

    weaknesses: {
      type: String,
      default: "",
    },

    // ── BELIEFS & WORLDVIEW ──────────────────────
    politicalView: {
      type: String,
      default: "",
    },

    religiousView: {
      type: String,
      default: "",
    },

    lifePhilosophy: {
      type: String,
      default: "",
    },

    opinionsOnTech: {
      type: String,
      default: "",
    },

    opinionsOnSociety: {
      type: String,
      default: "",
    },

    // ── BACKGROUND ───────────────────────────────
    earlyLife: {
      type: String,
      default: "",
    },

    keyEvents: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    achievements: {
      type: String,
      default: "",
    },

    // ── SPEECH STYLE ─────────────────────────────
    vocabLevel: {
      type: String,
      default: "",
    },

    tone: {
      type: String,
      default: "",
    },

    // Famous quotes — array of strings
    // e.g. ["When something is important...", "Failure is an option..."]
    famousQuotes: {
      type: [String],
      default: [],
    },
  },
  {
    // Automatically createdAt aur updatedAt add ho jaayengi
    timestamps: true,
  }
);

module.exports = mongoose.model("Persona", personaSchema);