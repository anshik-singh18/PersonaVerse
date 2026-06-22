const express = require("express");
const dotenv  = require("dotenv");
const cors    = require("cors");
const connectDB = require("./config/db");

// ============================================================
//  server.js — Main entry point
//  Yeh file server start karti hai
//  Sabse pehle yahi file run hoti hai: node server.js
// ============================================================

// .env file ki values load karo
dotenv.config();

// MongoDB se connect karo
connectDB();

// Express app banao
const app = express();

// ── MIDDLEWARE ──
// Frontend se aane wali JSON data parse karo
app.use(express.json());

// CORS — frontend (localhost:5173) ko backend call karne do
app.use(cors({
  origin: "*",  // React app ka URL
  credentials: true,
}));

// ── ROUTES ──
// Har route alag file mein hai — yahan connect karo
app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/personas", require("./routes/personaRoutes"));
app.use("/api/chat",     require("./routes/chatRoutes"));

// ── TEST ROUTE ──
// Browser mein localhost:5000 kholo — yeh dikhega
app.get("/", (req, res) => {
  res.json({ message: "PersonaVerse API is running!" });
});

// ── START SERVER ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});