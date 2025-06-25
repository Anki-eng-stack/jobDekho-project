const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { applyToJob } = require("../controllers/applicationController");

const router = express.Router();

router.post("/apply/:jobId", protect, authorize("jobseeker"), applyToJob);

module.exports = router;
