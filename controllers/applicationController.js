const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Job = require("../models/Job");
const Application = require("../models/Application");

// 1. Apply to a Job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;

    console.log("Received jobId:", jobId);
    console.log("User ID:", userId);

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const existing = await Application.findOne({ job: jobId, user: userId });
    if (existing) {
      return res.status(400).json({ error: "You already applied to this job" });
    }

    // Log file info
    console.log("req.files:", req.files);
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const file = req.files.resume;
    console.log("Temp file path:", file.tempFilePath);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "AnkanFolder",
      resource_type: "auto",
    });

    console.log("Cloudinary upload result:", result);

    fs.unlink(file.tempFilePath, () => {}); // cleanup temp file

    const application = await Application.create({
      job: jobId,
      user: userId,
      resumeUrl: result.secure_url,
      status: "applied",
    });

    res.status(201).json({ message: "Applied successfully", application });

  } catch (err) {
    console.error("❌ Apply error:", err);
    res.status(500).json({ error: "Server Error", detail: err.message });
  }
};


// 2. Get all applications for the logged-in user
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Application.find({ user: userId })
      .populate("job", "title company jobImage")
      .sort({ createdAt: -1 });

    const formatted = applications.map((app) => ({
      _id: app._id,
      jobId: app.job._id,
      job: app.job,
      resumeUrl: app.resumeUrl,
      status: app.status,
      createdAt: app.createdAt,
    }));

    res.json({ applications: formatted });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// 3. Recruiter: Get all applications for a job
exports.getApplicationsForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const applications = await Application.find({ job: jobId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};
