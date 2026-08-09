const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getProfile,
  getAdminDashboard,
  getEmail,
  requestPasswordReset,
  resetPassword,
  sendOTP,
  verifyOTP,
  getMailHealth
} = require("../controllers/authController");

const { protect, authorize } = require("../middleware/authMiddleware");
const { otpLimiter } = require("../middleware/rateLimiter");

// 📌 Public Routes
router.post("/signup", signup);
router.post("/login", login);

// 🔐 OTP-based login
router.post("/send-otp", otpLimiter, sendOTP); // Send OTP to email
router.post("/verify-otp", verifyOTP);  // Verify OTP and login
router.get("/mail-health", getMailHealth);

// 🔐 Password Reset
router.post("/request-reset", requestPasswordReset); 
router.post("/reset-password/:token", resetPassword); 

// 🔐 Protected Routes
router.get("/profile", protect, getProfile);

// 🔐 Admin-only
router.get("/admin-dashboard", protect, authorize("admin"), getAdminDashboard);

// 🔐 Get logged-in user's email
router.get("/getEmail", protect, getEmail);

// 🔐 Recruiter-only Route
router.get("/recruiter-dashboard", protect, authorize("recruiter"), (req, res) => {
  res.json({
    message: "Welcome to Recruiter Dashboard",
    user: req.user
  });
});

// 🔐 Student-only Route
router.get("/student-dashboard", protect, authorize("student"), (req, res) => {
  res.json({
    message: "Welcome to Student Dashboard",
    user: req.user
  });
});

module.exports = router;
