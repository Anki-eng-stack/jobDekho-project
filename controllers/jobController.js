const Job = require("../models/Job");
const cloudinary = require("../config/cloudinary");
const fs = require("fs"); // Added fs for file unlinking

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const cleanupTempFile = (file) => {
  if (!file?.tempFilePath) return;
  fs.unlink(file.tempFilePath, (err) => {
    if (err) console.warn("Failed to delete temp file:", err.message);
  });
};

const getUploadedFile = (file) => (Array.isArray(file) ? file[0] : file);

const validateImageFile = (file) => {
  if (!file) return null;
  if (!file.mimetype?.startsWith("image/")) {
    return "Only image files are allowed for job images";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Job image must be 5MB or smaller";
  }
  return null;
};

const uploadJobImage = async (file) => {
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "AnkanFolder",
    resource_type: "image",
  });

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

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
      if (!cloudinary.isConfigured || !cloudinary.isConfigured()) {
        return res.status(500).json({
          error: "Cloudinary is not configured. Check CLOUDINARY env keys.",
        });
      }

      const imageFile = getUploadedFile(req.files.image);
      const imageError = validateImageFile(imageFile);
      if (imageError) {
        cleanupTempFile(imageFile);
        return res.status(400).json({ error: imageError });
      }

      jobImage = await uploadJobImage(imageFile);
      cleanupTempFile(imageFile);
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
    if (err.http_code) {
      return res.status(500).json({
        error: "Job image upload failed on Cloudinary",
        detail: err.message,
      });
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
        
        // ⭐ MODIFIED LINE: Send as an object matching frontend's 'jobsPosted' expectation ⭐
        res.json({ jobsPosted: jobs }); 
    } catch (err) {
        // ⭐ MODIFIED LOG: Log the full error object for better debugging ⭐
        console.error("❌ Fetch Recruiter Jobs error (full object):", err);
        res.status(500).json({ error: "Failed to fetch recruiter's jobs", detail: err.message });
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
      if (!cloudinary.isConfigured || !cloudinary.isConfigured()) {
        return res.status(500).json({
          error: "Cloudinary is not configured. Check CLOUDINARY env keys.",
        });
      }

      const imageFile = getUploadedFile(req.files.image);
      const imageError = validateImageFile(imageFile);
      if (imageError) {
        cleanupTempFile(imageFile);
        return res.status(400).json({ error: imageError });
      }

      if (job.jobImage?.public_id) {
        await cloudinary.uploader.destroy(job.jobImage.public_id);
      }

      req.body.jobImage = await uploadJobImage(imageFile);
      cleanupTempFile(imageFile);
    }

    if (req.body.skills) {
      req.body.skills = Array.isArray(req.body.skills) ? req.body.skills : req.body.skills.split(",").map(s => s.trim()); // Ensure skills are an array and trimmed
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Job updated", updatedJob });
  } catch (err) {
    console.error("Update job error:", err.message);
    if (err.http_code) {
      return res.status(500).json({
        error: "Job image upload failed on Cloudinary",
        detail: err.message,
      });
    }
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
