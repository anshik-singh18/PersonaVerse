const Persona = require("../models/Persona");

// ============================================================
//  controllers/personaController.js
//
//  4 functions:
//    1. createPersona → naya persona banao
//    2. getPersonas   → user ke saare personas lo
//    3. getPersona    → ek specific persona lo (by id)
//    4. updatePersona → persona update karo
//    5. deletePersona → persona delete karo
// ============================================================


// ============================================================
//  CREATE PERSONA
//  POST /api/personas
//  Body: { fullName, avatar, profession, ... }
// ============================================================
const createPersona = async (req, res) => {
  try {
    // req.user middleware se aata hai (logged in user)
    // req.body form ka data hai

    const persona = await Persona.create({
      userId: req.user._id,   // kis user ka persona hai
      ...req.body,            // baaki saari form fields
    });

    res.status(201).json({
      message: "Persona created successfully",
      persona,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ============================================================
//  GET ALL PERSONAS (of logged in user)
//  GET /api/personas
// ============================================================
const getPersonas = async (req, res) => {
  try {
    // Sirf us user ke personas jo abhi logged in hai
    const personas = await Persona.find({ userId: req.user._id })
      .sort({ createdAt: -1 });   // latest pehle

    res.status(200).json({ personas });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ============================================================
//  GET SINGLE PERSONA
//  GET /api/personas/:id
// ============================================================
const getPersona = async (req, res) => {
  try {
    const persona = await Persona.findById(req.params.id);

    // Persona milа ya nahi
    if (!persona) {
      return res.status(404).json({ message: "Persona not found" });
    }

    // Kya yeh persona is user ka hai?
    if (persona.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({ persona });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ============================================================
//  UPDATE PERSONA
//  PUT /api/personas/:id
//  Body: jo bhi fields update karni hain
// ============================================================
const updatePersona = async (req, res) => {
  try {
    const persona = await Persona.findById(req.params.id);

    if (!persona) {
      return res.status(404).json({ message: "Persona not found" });
    }

    // Check karo ki yeh user ka hi persona hai
    if (persona.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update karo — jo fields aai hain woh update hongi
    const updatedPersona = await Persona.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }         // updated document wapas bhejo
    );

    res.status(200).json({
      message: "Persona updated successfully",
      persona: updatedPersona,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ============================================================
//  DELETE PERSONA
//  DELETE /api/personas/:id
// ============================================================
const deletePersona = async (req, res) => {
  try {
    const persona = await Persona.findById(req.params.id);

    if (!persona) {
      return res.status(404).json({ message: "Persona not found" });
    }

    // Check karo ki yeh user ka hi persona hai
    if (persona.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Persona.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Persona deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  createPersona,
  getPersonas,
  getPersona,
  updatePersona,
  deletePersona,
};