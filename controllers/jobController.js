const Job = require("../models/Job");
const cloudinary = require("../config/cloudinary");
const fs = require("fs"); // Added fs for file unlinking

// Create job (Recruiter only)
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, salary, description, skills, jobType } = req.body;
    const recruiterId = req.user.id; // Get recruiter ID from authenticated user

    console.log("--- createJob Log ---");
    console.log("Recruiter ID from token (req.user.id):", recruiterId);
    console.log("Request Body:", req.body);
    console.log("Job image files:", req.files?.image ? true : false);

    let jobImage = {};

    if (req.files && req.files.image) {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: "AnkanFolder" // Ensure this folder exists or is desired in Cloudinary
      });
      fs.unlink(req.files.image.tempFilePath, (err) => { // Delete local temp file
        if (err) console.warn("Failed to delete temp file:", err);
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
      // Ensure skills are an array of trimmed strings
      skills: Array.isArray(skills) ? skills : (skills?.split(",").map(s => s.trim()) || []),
      jobType,
      recruiter: recruiterId, // ⭐ This is the field that links to the recruiter User ⭐
      jobImage
    });

    console.log("Newly created Job document:", job);
    console.log("--- End createJob Log ---");

    res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    console.error("Create job error (full object):", err); // Log full error object
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        return res.status(400).json({ error: "Validation failed", details: errors });
    }
    res.status(500).json({ error: "Failed to create job", detail: err.message });
  }
};

// Get all jobs (Public)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiter", "name email role"); // Populate recruiter details
    res.json(jobs);
  } catch (err) {
    console.error("Get all jobs error:", err.message);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// Get single job
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiter", "name email"); // Populate recruiter details
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error("Get job by ID error:", err.message);
    res.status(500).json({ error: "Failed to fetch job" });
  }
};

// ⭐ NEW FUNCTION: Get jobs posted by the logged-in recruiter ⭐
exports.getRecruiterJobs = async (req, res) => {
    try {
        const recruiterId = req.user.id; // Get recruiter's ID from authenticated token
        console.log("Fetching jobs for recruiter ID:", recruiterId); // Log for debugging
        const jobs = await Job.find({ recruiter: recruiterId }).populate("recruiter", "name email");
        res.json(jobs);
    } catch (err) {
        console.error("❌ Fetch Recruiter Jobs error:", err.message);
        res.status(500).json({ error: "Failed to fetch recruiter's jobs" });
    }
};

// Update job (Recruiter or Admin)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // Ensure job.recruiter exists before comparing (for robustness)
    if (!job.recruiter || (req.user.role !== "admin" && job.recruiter.toString() !== req.user.id)) {
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
      fs.unlink(req.files.image.tempFilePath, (err) => { // Delete local temp file
        if (err) console.warn("Failed to delete temp file:", err);
      });

      req.body.jobImage = {
        public_id: result.public_id,
        url: result.secure_url
      };
    }

    if (req.body.skills) {
      req.body.skills = Array.isArray(req.body.skills) ? req.body.skills : req.body.skills.split(",").map(s => s.trim()); // Ensure skills are an array and trimmed
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Job updated", updatedJob });
  } catch (err) {
    console.error("Update job error:", err.message);
    res.status(500).json({ error: "Failed to update job" });
  }
};

// Delete job (Recruiter or Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // Ensure job.recruiter exists before comparing
    if (!job.recruiter || (req.user.role !== "admin" && job.recruiter.toString() !== req.user.id)) {
      return res.status(403).json({ error: "Not authorized to delete this job" });
    }

    // Delete image from cloudinary
    if (job.jobImage?.public_id) {
      await cloudinary.uploader.destroy(job.jobImage.public_id);
    }

    // Changed from job.remove() to job.deleteOne() for Mongoose 6+
    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete job error:", err.message);
    res.status(500).json({ error: "Failed to delete job" });
  }
};