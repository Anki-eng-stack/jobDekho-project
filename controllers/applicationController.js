const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");

// exports.applyToJob (Apply to a job - Applicant)
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;

    console.log("--- applyToJob Log ---");
    console.log("Applicant ID from token (req.user.id):", userId);
    console.log("Job ID from params:", jobId);
    console.log("Request Body (form fields):", req.body);

    if (!userId) return res.status(401).json({ error: "Unauthorized: User ID not found." });

    const job = await Job.findById(jobId);
    console.log("Fetched Job object:", job);
    console.log("Job's recruiter field:", job?.recruiter);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (!job.recruiter) {
      console.error("Error: Job recruiter is missing for Job ID:", jobId);
      return res.status(500).json({ error: "Job does not have an associated recruiter. Cannot apply." });
    }

    const existing = await Application.findOne({ job: jobId, user: userId });
    if (existing) {
      return res.status(400).json({ error: "You already applied to this job" });
    }

    if (!req.files || !req.files.resume) {
      return res.status(400).json({ error: "Resume file is required" });
    }
    const file = req.files.resume;
    console.log("Temp file path for resume:", file.tempFilePath);

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "AnkanFolder/Resumes",
      resource_type: "auto",
    });
    console.log("Cloudinary upload result:", result);

    fs.unlink(file.tempFilePath, (err) => {
      if (err) console.warn("Failed to delete temp file:", err);
    });

    const application = await Application.create({
      job: jobId,
      user: userId,
      recruiter: job.recruiter,
      resumeUrl: result.secure_url,
      name: req.body.name,
      email: req.body.email,
      marks: req.body.marks,
      grade: req.body.grade,
      experience: req.body.experience,
      skills: req.body.skills ? req.body.skills.split(',').map(s => s.trim()) : [],
      status: "applied",
    });

    console.log("Newly created Application document:", application);

    const interviewDate = new Date();
    interviewDate.setDate(interviewDate.getDate() + 3);
    interviewDate.setUTCHours(10, 0, 0, 0);

    const defaultMode = "online";
    const defaultLocation = "https://meet.google.com/your-default-link";
    const defaultNotes = "This is an automatically scheduled preliminary interview. You will receive a separate email with meeting details shortly.";

    const interview = await Interview.create({
      application: application._id,
      job: job._id,
      applicant: userId,
      recruiter: job.recruiter,
      date: interviewDate,
      mode: defaultMode,
      location: defaultLocation,
      notes: defaultNotes,
      jobTitle: job.title,
      status: 'scheduled'
    });

    console.log("Newly created Interview document:", interview);

    application.interview = interview._id;
    application.status = "interview_scheduled";
    await application.save();
    console.log("Updated Application document after interview link:", application);

    res.status(201).json({ message: "Application submitted", application, interview });
    console.log("--- End applyToJob Log ---");
  } catch (err) {
    console.error("❌ Apply error (full object):", err);
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        return res.status(400).json({ error: "Validation failed", details: errors });
    }
    res.status(500).json({ error: "Server Error", detail: err.message });
  }
};


exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Application.find({ user: userId })
      .populate("job", "title company jobImage")
      .populate("interview")
      .sort({ createdAt: -1 });

    const formatted = applications.map((app) => ({
      _id: app._id,
      jobId: app.job?._id,
      job: app.job,
      resumeUrl: app.resumeUrl,
      status: app.status,
      createdAt: app.createdAt,
      name: app.name,
      email: app.email,
      marks: app.marks,
      grade: app.grade,
      experience: app.experience,
      skills: app.skills,
      interview: app.interview,
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
      .populate("job", "title company")
      .populate("interview")
      .sort({ createdAt: -1 });

    const formatted = applications.map((app) => ({
      _id: app._id,
      job: app.job,
      user: app.user,
      resumeUrl: app.resumeUrl,
      status: app.status,
      createdAt: app.createdAt,
      name: app.name,
      email: app.email,
      marks: app.marks,
      grade: app.grade,
      experience: app.experience,
      skills: app.skills,
      interview: app.interview,
    }));

    res.json({ applications: formatted });
  } catch (err) {
    console.error("❌ Fetch Applications For Job error:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await Application.findById(applicationId)
      .populate("user", "name email")
      .populate("job", "title company recruiter")
      .populate("interview");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (!application.job || (application.job.recruiter.toString() !== req.user.id && req.user.role !== "admin")) {
      return res.status(403).json({ error: "Not authorized to view this application." });
    }

    res.json({ application });
  } catch (err) {
    console.error("❌ Fetch Application By ID error:", err);
    res.status(500).json({ error: "Failed to fetch application details." });
  }
};

exports.cancelApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // ⭐ FIX: Added check for application.recruiter before toString() ⭐
    // This handles cases where old documents might not have the recruiter field
    if (!application.recruiter || (application.user.toString() !== userId && req.user.role !== 'admin')) {
      return res.status(403).json({ error: "Not authorized to cancel this application" });
    }

    if (['hired', 'rejected'].includes(application.status)) {
        return res.status(400).json({ error: `Cannot cancel application with status: ${application.status}` });
    }

    application.status = "cancelled";
    await application.save(); // This is where the validation error occurs for old data

    res.status(200).json({ message: "Application cancelled successfully", application });

  } catch (err) {
      console.error("❌ Cancel application error (full object):", err);
      if (err.name === 'ValidationError') {
          const errors = Object.values(err.errors).map(el => el.message);
          return res.status(400).json({ error: "Validation failed", details: errors });
      }
      res.status(500).json({ error: "Failed to cancel application", detail: err.message });
  }
};