const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const registrationRoutes = require("./routes/registration.routes");

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3001"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

// Connect DB
connectDB();

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "KRMU Backend Running 🚀" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/registrations", registrationRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
