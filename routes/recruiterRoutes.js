const router = require("express").Router();
const { getRecruiterDashboard } = require("../controllers/recruiterController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("recruiter", "admin"), getRecruiterDashboard);

module.exports = router;
