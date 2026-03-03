const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

exports.getAdminDashboard = async (req, res) => {
  try {
    const [users, jobs, applications] = await Promise.all([
      User.find().select("-password"),
      Job.find().populate("recruiter", "name email"),
      Application.find()
        .populate("job", "title")
        .sort({ createdAt: -1 }),
    ]);

    const formattedApplications = applications.map((app) => ({
      _id: app._id,
      jobTitle: app.job?.title || "N/A",
      status: app.status,
    }));

    res.json({ users, jobs, applications: formattedApplications });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin dashboard" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

exports.getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiter", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

exports.deleteJobAdmin = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    await job.deleteOne();
    res.json({ message: "Job deleted by admin" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete job" });
  }
};
