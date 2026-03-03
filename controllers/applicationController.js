const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Job = require("../models/Job");
const Application = require("../models/Application");

const normalizeStatus = (status) => {
  const value = String(status || "").toLowerCase().trim();
  if (value === "reviewed" || value === "under_review") return "shortlisted";
  if (value === "hired") return "selected";
  if (value === "cancelled") return "withdrawn";
  return value;
};

const pushHistory = (application, status, changedBy, note = "") => {
  const normalized = normalizeStatus(status);
  const last = application.statusHistory?.[application.statusHistory.length - 1];
  if (last && last.status === normalized) return;
  application.statusHistory = application.statusHistory || [];
  application.statusHistory.push({
    status: normalized,
    date: new Date(),
    note,
    changedBy: changedBy || undefined,
  });
};

const emitStatusUpdate = (req, application) => {
  const io = req.app.get("io");
  if (!io || !application) return;

  const payload = {
    applicationId: application._id,
    jobId: application.job?._id || application.job,
    userId: application.user?._id || application.user,
    recruiterId: application.recruiter?._id || application.recruiter,
    status: normalizeStatus(application.status),
    statusHistory: (application.statusHistory || []).map((entry) => ({
      status: normalizeStatus(entry.status),
      date: entry.date,
      note: entry.note || "",
      changedBy: entry.changedBy,
    })),
    updatedAt: application.updatedAt || new Date(),
  };

  if (payload.userId) io.to(`user:${payload.userId.toString()}`).emit("application:status-updated", payload);
  if (payload.recruiterId) io.to(`user:${payload.recruiterId.toString()}`).emit("application:status-updated", payload);
};

exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found." });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (!job.recruiter) {
      return res.status(500).json({ error: "Job has no recruiter linked." });
    }

    const existing = await Application.findOne({ job: jobId, user: userId });
    if (existing) {
      return res.status(400).json({ error: "You already applied to this job" });
    }

    if (!req.files || !req.files.resume) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    if (!cloudinary.isConfigured || !cloudinary.isConfigured()) {
      return res.status(500).json({
        error: "Cloudinary is not configured. Check CLOUDINARY env keys.",
      });
    }

    const file = req.files.resume;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "AnkanFolder/Resumes",
      resource_type: "auto",
    });

    fs.unlink(file.tempFilePath, (unlinkErr) => {
      if (unlinkErr) console.warn("Failed to delete temp file:", unlinkErr.message);
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
      skills: req.body.skills ? req.body.skills.split(",").map((s) => s.trim()) : [],
      status: "applied",
      statusHistory: [
        {
          status: "applied",
          date: new Date(),
          note: "Application submitted",
          changedBy: userId,
        },
      ],
    });
    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    if (err.http_code) {
      return res.status(500).json({
        error: "Resume upload failed on Cloudinary",
        detail: err.message,
      });
    }

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((el) => el.message);
      return res.status(400).json({ error: "Validation failed", details: errors });
    }

    console.error("Apply error:", err.message);
    res.status(500).json({ error: "Server Error", detail: err.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Application.find({ user: userId })
      .populate("job", "title company jobImage recruiter")
      .populate("interview")
      .populate("statusHistory.changedBy", "name role")
      .sort({ createdAt: -1 });

    const formatted = applications.map((app) => ({
      _id: app._id,
      jobId: app.job?._id,
      job: app.job,
      resumeUrl: app.resumeUrl,
      status: normalizeStatus(app.status),
      statusHistory: (app.statusHistory || []).map((entry) => ({
        status: normalizeStatus(entry.status),
        date: entry.date,
        note: entry.note,
        changedBy: entry.changedBy,
      })),
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
    console.error("Fetch My Applications error:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId).select("recruiter");
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isOwnerRecruiter =
      req.user.role === "recruiter" &&
      job.recruiter &&
      job.recruiter.toString() === req.user.id;
    if (!isAdmin && !isOwnerRecruiter) {
      return res.status(403).json({ error: "Not authorized to view applications for this job" });
    }

    const applications = await Application.find({ job: jobId })
      .populate("user", "name email")
      .populate("job", "title company recruiter")
      .populate("interview")
      .populate("statusHistory.changedBy", "name role")
      .sort({ createdAt: -1 });

    const formatted = applications.map((app) => ({
      _id: app._id,
      job: app.job,
      user: app.user,
      resumeUrl: app.resumeUrl,
      status: normalizeStatus(app.status),
      statusHistory: (app.statusHistory || []).map((entry) => ({
        status: normalizeStatus(entry.status),
        date: entry.date,
        note: entry.note,
        changedBy: entry.changedBy,
      })),
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
    console.error("Fetch Applications For Job error:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await Application.findById(applicationId)
      .populate("user", "name email")
      .populate("job", "title company recruiter")
      .populate("interview")
      .populate("statusHistory.changedBy", "name role");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const isOwner = application.user && application.user._id.toString() === req.user.id;
    const isRecruiter =
      application.job &&
      application.job.recruiter &&
      application.job.recruiter.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isRecruiter && !isAdmin) {
      return res.status(403).json({ error: "Not authorized to view this application." });
    }

    application.status = normalizeStatus(application.status);
    application.statusHistory = (application.statusHistory || []).map((entry) => ({
      ...entry.toObject?.() || entry,
      status: normalizeStatus(entry.status),
    }));

    res.json({ application });
  } catch (err) {
    console.error("Fetch Application By ID error:", err);
    res.status(500).json({ error: "Failed to fetch application details." });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const requestedStatus = normalizeStatus(req.body.status);
    const note = req.body.note || "";

    const allowed = ["applied", "shortlisted", "interview_scheduled", "selected", "rejected"];
    if (!allowed.includes(requestedStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const application = await Application.findById(applicationId).populate("job", "recruiter");
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isOwnerRecruiter =
      req.user.role === "recruiter" &&
      application.job &&
      application.job.recruiter &&
      application.job.recruiter.toString() === req.user.id;
    if (!isAdmin && !isOwnerRecruiter) {
      return res.status(403).json({ error: "Not authorized to update this application status" });
    }

    const currentStatus = normalizeStatus(application.status);
    const validTransitions = {
      applied: ["shortlisted", "rejected"],
      shortlisted: ["interview_scheduled", "rejected"],
      interview_scheduled: ["selected", "rejected", "shortlisted"],
      selected: [],
      rejected: [],
      withdrawn: [],
    };
    const nextAllowed = validTransitions[currentStatus] || [];
    if (requestedStatus !== currentStatus && !nextAllowed.includes(requestedStatus)) {
      return res.status(400).json({
        error: `Invalid status transition from ${currentStatus} to ${requestedStatus}`,
      });
    }
    if (requestedStatus === "interview_scheduled" && !application.interview) {
      return res.status(400).json({
        error: "Interview is not scheduled yet. Please schedule interview first.",
      });
    }

    application.status = requestedStatus;
    pushHistory(application, requestedStatus, req.user.id, note || "Status updated by recruiter");
    await application.save();
    emitStatusUpdate(req, application);

    res.json({ message: "Application status updated", application });
  } catch (err) {
    res.status(500).json({ error: "Failed to update application status", detail: err.message });
  }
};

exports.withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;
    const application = await Application.findById(applicationId).populate("job", "recruiter");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.user.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to withdraw this application" });
    }

    if (["selected", "rejected", "withdrawn"].includes(normalizeStatus(application.status))) {
      return res.status(400).json({ error: `Cannot withdraw application with status: ${application.status}` });
    }

    application.status = "withdrawn";
    pushHistory(application, "withdrawn", userId, "Application withdrawn by candidate");
    await application.save();
    emitStatusUpdate(req, application);

    res.status(200).json({ message: "Application withdrawn successfully", application });
  } catch (err) {
    res.status(500).json({ error: "Failed to withdraw application", detail: err.message });
  }
};

exports.cancelApplication = exports.withdrawApplication;
