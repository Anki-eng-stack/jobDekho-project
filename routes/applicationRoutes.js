const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
} = require("../controllers/applicationController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Configure a local tmp directory
const tmpDir = path.join(__dirname, "../tmp");
router.use((req, res, next) => {
  // ensure tmpDir exists
  require("fs").mkdirSync(tmpDir, { recursive: true });
  next();
});

// Only this route needs fileUpload
router.post(
  "/apply/:jobId",
  fileUpload({
    useTempFiles: true,
    tempFileDir: tmpDir,
    createParentPath: true,
  }),
  protect,
  authorize("jobseeker"),
  applyToJob
);

router.get("/my", protect, authorize("jobseeker"), getMyApplications);
router.get(
  "/job/:jobId",
  protect,
  authorize("recruiter", "admin"),
  getApplicationsForJob
);

module.exports = router;
