const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to ClincDB");
  } catch (error) {
    console.error("MonggoDB connection error:", error);
    process.exit(1);
  }
};
module.exports = connectDb;