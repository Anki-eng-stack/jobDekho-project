const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Job = require("../models/Job");
const Application = require("../models/Application");

exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;

    console.log("Incoming apply request for job:", jobId, "from user:", userId);

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (!req.files || !req.files.resume) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    console.log("Uploading file to Cloudinary...");

    const file = req.files.resume;

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "AnkanFolder",
      resource_type: "raw"
    });

    fs.unlink(file.tempFilePath, () => {}); // optional cleanup

    const application = await Application.create({
      job: jobId,
      user: userId,
      resumeUrl: result.secure_url
    });

    res.status(201).json({
      message: "Applied successfully",
      application
    });

  } catch (err) {
    console.error("Full error stack:", err);
    res.status(500).json({ error: "Server error during application", detail: err.message });
  }
};
