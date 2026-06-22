const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createPersona,
  getPersonas,
  getPersona,
  updatePersona,
  deletePersona,
} = require("../controllers/personaController");

// ============================================================
//  routes/personaRoutes.js
//
//  Saare persona routes PROTECTED hain —
//  matlab login hona zaroori hai (protect middleware)
//
//  Routes:
//    POST   /api/personas        → naya persona banao
//    GET    /api/personas        → saare personas lo
//    GET    /api/personas/:id    → ek persona lo
//    PUT    /api/personas/:id    → persona update karo
//    DELETE /api/personas/:id    → persona delete karo
// ============================================================

router.post("/",        protect, createPersona);
router.get("/",         protect, getPersonas);
router.get("/:id",      protect, getPersona);
router.put("/:id",      protect, updatePersona);
router.delete("/:id",   protect, deletePersona);

module.exports = router;