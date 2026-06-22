const express = require("express");
const router  = express.Router();
const { signup, login } = require("../controllers/authController");

// ============================================================
//  routes/authRoutes.js
//
//  Auth ke liye 2 routes:
//    POST /api/auth/signup  → naya account banao
//    POST /api/auth/login   → login karo
//
//  In routes pe koi middleware nahi — login se pehle
//  token nahi hota toh protect middleware nahi lagega
// ============================================================

router.post("/signup", signup);
router.post("/login",  login);

module.exports = router;