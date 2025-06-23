const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getProfile,
  getAdminDashboard,
  getEmail
} = require("../controllers/authController");

const { protect, authorize } = require("../middleware/authMiddleware");

// 📌 Public Routes
router.post("/signup", signup);
router.post("/login", login);

// 🔐 Protected Routes
router.get("/profile", protect, getProfile); // Any logged-in user

// 🔐 Admin Dashboard
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
