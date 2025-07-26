const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  getApplicationById,
  cancelApplication, // ⭐ IMPORTANT: Ensure cancelApplication is imported ⭐
} = require("../controllers/applicationController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Configure a local tmp directory (ensure this path is correct for your setup)
const tmpDir = path.join(__dirname, "../tmp");
router.use((req, res, next) => {
  // ensure tmpDir exists
  require("fs").mkdirSync(tmpDir, { recursive: true });
  next();
});

// Apply protect middleware to all routes in this router by default
router.use(protect);

// 1. POST /api/applications/apply/:jobId - Apply to a job (Jobseeker only)
// This route uses fileUpload middleware for resume upload
router.post(
  "/apply/:jobId",
  fileUpload({
    useTempFiles: true,
    tempFileDir: tmpDir,
    createParentPath: true,
  }),
  authorize("jobseeker"),
  applyToJob
);

// 2. GET /api/applications/my - Get applications for the logged-in jobseeker
router.get("/my", authorize("jobseeker"), getMyApplications);

// 3. GET /api/applications/job/:jobId - Get all applications for a specific job (Recruiter/Admin)
router.get(
  "/job/:jobId",
  authorize("recruiter", "admin"),
  getApplicationsForJob
);

// 4. GET /api/applications/:applicationId - Get a single application by ID (Recruiter/Admin/Jobseeker)
// Authorization logic is handled within the getApplicationById controller
router.get(
  "/:applicationId",
  authorize("recruiter", "admin", "jobseeker"),
  getApplicationById
);

// ⭐ 5. DELETE /api/applications/cancel/:applicationId - Cancel an application (Jobseeker/Admin) ⭐
router.delete(
  "/cancel/:applicationId", // Matches the frontend URL: /api/applications/cancel/:applicationId
  authorize("jobseeker", "admin"), // Allow jobseeker to cancel their own, or admin to cancel any
  cancelApplication
);


module.exports = router;