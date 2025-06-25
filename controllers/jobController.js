const Job = require("../models/Job");
const cloudinary = require("../config/cloudinary");

// Create job (Recruiter only)
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, salary, description, skills, jobType } = req.body;

    let jobImage = {};

    if (req.files && req.files.image) {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: "AnkanFolder"
      });

      jobImage = {
        public_id: result.public_id,
        url: result.secure_url
      };
    }

    const job = await Job.create({
      title,
      company,
      location,
      salary,
      description,
      skills: Array.isArray(skills) ? skills : (skills?.split(",") || []),

      jobType,
      postedBy: req.user.id,
      jobImage
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    console.error("Create job error:", err.message);
    res.status(500).json({ error: "Failed to create job", detail: err.message });
  }
};

// Get all jobs (Public)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email role");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// Get single job
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch job" });
  }
};

// Update job (Recruiter or Admin)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (req.user.role !== "admin" && job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this job" });
    }

    // If updating image
    if (req.files && req.files.image) {
      if (job.jobImage?.public_id) {
        await cloudinary.uploader.destroy(job.jobImage.public_id);
      }

      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: "AnkanFolder"
      });

      req.body.jobImage = {
        public_id: result.public_id,
        url: result.secure_url
      };
    }

    if (req.body.skills) {
      req.body.skills = req.body.skills.split(",");
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Job updated", updatedJob });
  } catch (err) {
    res.status(500).json({ error: "Failed to update job" });
  }
};

// Delete job (Recruiter or Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (req.user.role !== "admin" && job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this job" });
    }

    // Delete image from cloudinary
    if (job.jobImage?.public_id) {
      await cloudinary.uploader.destroy(job.jobImage.public_id);
    }

    await job.remove();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete job" });
  }
};
