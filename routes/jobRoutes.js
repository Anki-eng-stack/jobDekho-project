const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { createJob, getAllJobs } = require("../controllers/jobController");

// ✅ Only recruiter or admin can post jobs
router.post("/", protect, authorize("recruiter", "admin"), createJob);

// ✅ Public route to get jobs (with search/pagination)
router.get("/", getAllJobs);

module.exports = router;
