const mongoose = require("mongoose");

// ============================================================
//  config/db.js
//  MongoDB se connection karta hai
//  .env file se MONGO_URI leta hai
// ============================================================

const connectDB = async () => {
  try {
    // MongoDB se connect karo
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Connection fail ho toh server band kar do
    process.exit(1);
  }
};

module.exports = connectDB;