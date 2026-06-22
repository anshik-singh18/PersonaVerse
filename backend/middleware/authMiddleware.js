const jwt  = require("jsonwebtoken");
const User = require("../models/User");

// ============================================================
//  middleware/authMiddleware.js
//
//  Yeh middleware check karta hai ki request karne wala
//  user logged in hai ya nahi.
//
//  Kaise kaam karta hai:
//    1. Request ke header mein token dhundho
//    2. Token valid hai ya nahi check karo
//    3. Valid hai → aage jaane do (next())
//    4. Valid nahi → error bhejo
//
//  Use hoga: har us route pe jo login ke baad hi access ho
//  e.g. personas create karna, chat karna
// ============================================================

const protect = async (req, res, next) => {
  try {
    // Request header se token lo
    // Frontend har request mein yeh bhejta hai:
    // Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    // Agar token hai hi nahi
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // "Bearer tokenvalue" mein se sirf token nikalo
    const token = authHeader.split(" ")[1];

    // Token verify karo — JWT_SECRET se decode hoga
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token mein se user ka id nikalo aur database se user dhundho
    // Password field nahi chahiye isliye "-password" likha
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Sab theek hai — aage jaane do
    next();

  } catch (error) {
    // Token expired ya invalid
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = { protect };