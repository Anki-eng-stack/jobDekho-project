const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Job = require("../models/Job");
const Application = require("../models/Application");

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

    if (!req.files || !req.files.resume) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const file = req.files.resume;
    console.log("Temp file path:", file.tempFilePath);

    // upload raw file (e.g. PDF) auto‑detected
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "AnkanFolder/Resumes",
      resource_type: "auto",
    });
    console.log("Cloudinary upload result:", result);

    // cleanup temp file
    fs.unlink(file.tempFilePath, (err) => {
      if (err) console.warn("Failed to delete temp file:", err);
    });

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


exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Application.find({ user: userId })
      .populate("job", "title company jobImage")
      .sort({ createdAt: -1 });

    // format for frontend
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
    console.error("❌ Fetch My Applications error:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};


exports.getApplicationsForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const applications = await Application.find({ job: jobId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    console.error("❌ Fetch Applications For Job error:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};
