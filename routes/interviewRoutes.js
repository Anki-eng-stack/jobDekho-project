const express = require("express");
const {
  createInterview,
  getMyInterviews,
  getAllInterviews,
  getInterviewById,
  deleteInterview,
  updateInterview, // <--- Import the new updateInterview function
} = require("../controllers/interviewController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply 'protect' middleware to all routes in this router by default
// This ensures only authenticated users can access any interview routes.
router.use(protect);

// Routes for managing interviews

// 1. Create an Interview (Manual Scheduling by Recruiter)
// POST /api/interviews
router.post("/", authorize(["recruiter"]), createInterview);

// 2. Get Interviews for the Logged-in Jobseeker
// GET /api/interviews/my
router.get("/my", authorize(["jobseeker"]), getMyInterviews);

// 3. Get All Interviews (Accessible by Recruiter and Admin)
// GET /api/interviews
router.get("/", authorize(["recruiter", "admin"]), getAllInterviews);

// 4. Get Single Interview by ID
// GET /api/interviews/:id
// Accessible by the recruiter who created it, the applicant it's for, or an admin.
// The granular check is typically done within the controller's getInterviewById function
// or a more sophisticated authorization middleware. For simplicity here,
// we allow any of these roles to attempt to fetch, and the controller will validate ownership.
router.get("/:id", authorize(["recruiter", "admin", "jobseeker"]), getInterviewById);

// 5. Update an Interview (Recruiter or Admin)
// PUT /api/interviews/:id
router.put("/:id", authorize(["recruiter", "admin"]), updateInterview);

// 6. Delete an Interview (Recruiter or Admin)
// DELETE /api/interviews/:id
router.delete("/:id", authorize(["recruiter", "admin"]), deleteInterview);

module.exports = router;