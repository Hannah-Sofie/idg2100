const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please enter your full name"],
    trim: true,
    min: 1,
    max: 50,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    lowercase: true,
    unique: true,
    trim: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    min: 8,
  },
  department: String,
  university: String,
  position: {
    type: String,
    enum: ["student", "teacher", "ta", "other"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
