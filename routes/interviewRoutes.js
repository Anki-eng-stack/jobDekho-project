const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createInterview,
  getAllInterviews,
  getInterviewById,  // ✅ Add comma here
  deleteInterview     // ✅ Delete controller
} = require("../controllers/interviewController");

const router = express.Router();

// Public Routes
router.get("/", getAllInterviews);
router.get("/:id", getInterviewById);

// Protected Routes
router.post("/", protect, createInterview);
router.delete("/:id", protect, deleteInterview);

module.exports = router;
