const router = require("express").Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
} = require("../controllers/jobController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getAllJobs); // Public
router.get("/:id", getJobById); // Public

router.post("/", protect, authorize("recruiter", "admin"), createJob); // Recruiter/Admin
router.put("/:id", protect, authorize("recruiter", "admin"), updateJob); // Recruiter/Admin
router.delete("/:id", protect, authorize("recruiter", "admin"), deleteJob); // Recruiter/Admin

module.exports = router;
