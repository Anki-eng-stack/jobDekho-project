const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");
const { apiLimiter } = require("./middleware/rateLimiter");

// Load .env variables early
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // Parse JSON body
app.use(helmet());       // Secure headers
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser()); // Parse cookies
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
})); // For handling image uploads

// Apply Rate Limiter to /api/*
app.use("/api", apiLimiter);

// Routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const salaryRoutes = require("./routes/salaryRoutes");
 const interviewRoutes = require("./routes/interviewRoutes");
 const recruiterRoutes = require("./routes/recruiterRoutes");
 const adminRoutes = require("./routes/adminRoutes");
 const applicationRoutes=require("./routes/applicationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/reviews", reviewRoutes);
 app.use("/api/salaries", salaryRoutes);
 app.use("/api/interviews", interviewRoutes);
 app.use("/api/recruiter", recruiterRoutes);
 app.use("/api/admin", adminRoutes);
 app.use("/api/application",applicationRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 JobDekho API is running");
});

// Global Error Handler (optional, catches thrown errors)
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ error: "Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
