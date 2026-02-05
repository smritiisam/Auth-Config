const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Validate config FIRST - before any other imports
const config = require("./config/env");

// Now import routes
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend-static directory
app.use(express.static(path.join(__dirname, "../frontend-static")));

// API Routes
app.use("/api/auth", authRoutes);

// Root route - serve login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend-static/index.html"));
});

// Connect to MongoDB
mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start server only after successful DB connection
    app.listen(config.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${config.PORT}`);
      console.log(`📝 Environment: ${config.NODE_ENV}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err.message);
  process.exit(1);
});
