const Job = require("../models/Job");

// ✅ Create Job - recruiter/admin only
exports.createJob = async (req, res) => {
  try {
    // Only recruiter or admin should access this route (handled by middleware)
    const { title, description, location, salaryRange, experience, company } = req.body;

    const job = await Job.create({
      title,
      description,
      location,
      salaryRange,
      experience,
      company,
      postedBy: req.user.id // added from JWT in protect middleware
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, error: "Job creation failed" });
  }
};

// ✅ Get All Jobs (with pagination, search)
exports.getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      $or: [
        { title:       { $regex: search, $options: "i" } },
        { company:     { $regex: search, $options: "i" } },
        { location:    { $regex: search, $options: "i" } },
      ]
    };

    const jobs = await Job.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({ success: true, jobs, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch jobs" });
  }
};
