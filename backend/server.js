require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/dbconnect");

const app = express();

// Apply middleware
const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse Cookie header and populate req.cookies

// Mount API routes for user-related operations
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Mount API routes for card-related operations
app.use("/api/cards/upload", require("./routes/cards/adminRoutes"));
app.use("/api/cards/assessment", require("./routes/cards/assessmentRoutes"));
app.use("/api/cards/mission", require("./routes/cards/missionRoutes"));

// Catch-all handler for all other routes not defined, returns a 404 Not Found error
app.use((req, res, next) => {
  res.status(404).json({
    message: "Endpoint Not Found",
  });
});

// Connect to the database and start the server
connectDB();

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Listen for SIGINT signal (e.g., from pressing Ctrl+C) to gracefully shutdown the server
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close(); // Close MongoDB connection
  console.log("MongoDB connection closed.");
  process.exit(0); // Exit the process
});

// Expose connectDB for potential use in other parts of the application
module.exports = connectDB;
