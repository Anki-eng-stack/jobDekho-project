const router = require("express").Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs // ⭐ FIX 1: Import the getRecruiterJobs controller function ⭐
} = require("../controllers/jobController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes (accessible without login)
router.get("/", getAllJobs); // Get all jobs (for job seekers)
router.get("/:id", getJobById); // Get single job by ID (for job seekers)

// Protected routes (require authentication)
router.post("/", protect, authorize("recruiter", "admin"), createJob); // Create job (Recruiter/Admin)
router.put("/:id", protect, authorize("recruiter", "admin"), updateJob); // Update job (Recruiter/Admin)
router.delete("/:id", protect, authorize("recruiter", "admin"), deleteJob); // Delete job (Recruiter/Admin)

// ⭐ FIX 2: Add the route for getting jobs posted by the logged-in recruiter ⭐
router.get("/recruiter/my-jobs", protect, authorize("recruiter"), getRecruiterJobs);


module.exports = router;