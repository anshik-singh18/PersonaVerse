const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

// ============================================================
//  models/User.js
//
//  Yeh model define karta hai ki MongoDB mein
//  ek User ka data kis format mein save hoga.
//
//  Ek User ke paas:
//    - name, email, password
//    - timestamps (kab banaya, kab update hua)
// ============================================================

const userSchema = new mongoose.Schema(
  {
    // User ka naam
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,           // extra spaces hata do
    },

    // Email — unique hona chahiye (do log same email se signup nahi kar sakte)
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,      // hamesha lowercase mein save karo
      trim: true,
    },

    // Password — plain text nahi, encrypted save hoga
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  {
    // Automatically createdAt aur updatedAt fields add ho jaayengi
    timestamps: true,
  }
);

// ============================================================
//  PRE-SAVE HOOK
//  Jab bhi user save ho, password automatically encrypt ho jaaye
//  Bcrypt password ko hash karta hai — seedha save nahi hota
// ============================================================
userSchema.pre("save", async function (next) {
  // Agar password change nahi hua toh encrypt mat karo dobara
  if (!this.isModified("password")) return next();

  // Password ko hash karo (10 = kitna strong encryption)
  this.password = await bcrypt.hash(this.password, 10);
});

// ============================================================
//  METHOD: comparePassword
//  Login ke time user ka password check karne ke liye
//  Returns true if password matches, false otherwise
// ============================================================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Model export karo taaki doosri files use kar sakein
module.exports = mongoose.model("User", userSchema);