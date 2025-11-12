// config/databaseConnect.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/login");
    console.log("MongoDB connected successfully");
  } catch (err){
    console.log("Database connection error:", err);
  }
};

connectDB();

module.exports = connectDB;


