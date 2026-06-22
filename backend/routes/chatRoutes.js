const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { sendMessage, getChat, getAllChats } = require("../controllers/chatController");

// ============================================================
//  routes/chatRoutes.js
//
//  Saare chat routes PROTECTED hain
//
//  Routes:
//    POST /api/chat/send          → message bhejo, AI reply lo
//    GET  /api/chat               → saari recent chats lo
//    GET  /api/chat/:personaId    → ek persona ki chat history lo
// ============================================================

router.post("/send",          protect, sendMessage);
router.get("/",               protect, getAllChats);
router.get("/:personaId",     protect, getChat);

module.exports = router;