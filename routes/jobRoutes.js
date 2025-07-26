const router = require("express").Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs // Ensure getRecruiterJobs is imported
} = require("../controllers/jobController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes (accessible without login)
// The general "get all jobs" route
router.get("/", getAllJobs);

// ⭐ FIX 1: Place the specific "/my-jobs" route BEFORE the general "/:id" route ⭐
// This route is for recruiters to get their own posted jobs
router.get("/my-jobs", protect, authorize("recruiter"), getRecruiterJobs); // ⭐ FIX 2: Changed path from "/recruiter/my-jobs" to "/my-jobs" ⭐

// Protected routes (require authentication)
router.post("/", protect, authorize("recruiter", "admin"), createJob); // Create job (Recruiter/Admin)

// The general "get single job by ID" route, and update/delete
router.route("/:id")
  .get(getJobById) // Get single job by ID (for job seekers or general view)
  .put(protect, authorize("recruiter", "admin"), updateJob) // Update job (Recruiter/Admin)
  .delete(protect, authorize("recruiter", "admin"), deleteJob); // Delete job (Recruiter/Admin)


module.exports = router;