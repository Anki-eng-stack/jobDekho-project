// index.js (or server.js)

const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");
const { apiLimiter } = require("./middleware/rateLimiter");

// Load .env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Ensure temp directory exists
const tmpDir = path.join(__dirname, "tmp");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

// Middleware
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

// File upload: use a local tmp folder (cross‐platform safe)
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: tmpDir,
//     createParentPath: true,
//   })
// );

// Rate limiter on all /api routes
app.use("/api", apiLimiter);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/salaries", require("./routes/salaryRoutes"));
app.use("/api/interviews", require("./routes/interviewRoutes"));
app.use("/api/recruiter", require("./routes/recruiterRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

// Root
app.get("/", (req, res) => {
  res.send("🚀 JobDekho API is running");
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err);
  res.status(500).json({ error: "Server Error", detail: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
