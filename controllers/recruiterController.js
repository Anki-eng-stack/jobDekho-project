const Job = require("../models/Job");
const Review = require("../models/Review");
const Application = require("../models/Application");

const normalizeStatus = (status) => {
  const value = String(status || "").toLowerCase().trim();
  if (value === "reviewed" || value === "under_review") return "shortlisted";
  if (value === "hired") return "selected";
  if (value === "cancelled") return "withdrawn";
  return value;
};

exports.getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobs = await Job.find({ recruiter: recruiterId }).sort({ createdAt: -1 });
    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .select("job status createdAt")
      .lean();

    const statusBreakdown = {
      applied: 0,
      shortlisted: 0,
      interview_scheduled: 0,
      selected: 0,
      rejected: 0,
      withdrawn: 0,
    };

    for (const application of applications) {
      const normalized = normalizeStatus(application.status);
      if (statusBreakdown[normalized] !== undefined) {
        statusBreakdown[normalized] += 1;
      }
    }

    const applicationsByJob = jobs.map((job) => {
      const counts = {
        applied: 0,
        shortlisted: 0,
        interview_scheduled: 0,
        selected: 0,
        rejected: 0,
        withdrawn: 0,
      };

      for (const app of applications) {
        if (String(app.job) !== String(job._id)) continue;
        const normalized = normalizeStatus(app.status);
        if (counts[normalized] !== undefined) counts[normalized] += 1;
      }

      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        total: Object.values(counts).reduce((sum, n) => sum + n, 0),
        counts,
      };
    });

    const reviews = await Review.find({}).populate({
      path: "job",
      populate: { path: "recruiter", select: "_id" },
    });

    const myReviews = reviews.filter(
      (review) => review.job?.recruiter?._id.toString() === recruiterId
    );

    res.json({
      message: "Recruiter dashboard data fetched successfully",
      jobsPosted: jobs,
      reviewsReceived: myReviews,
      analytics: {
        totalJobsPosted: jobs.length,
        totalApplications: applications.length,
        shortlistedCount: statusBreakdown.shortlisted,
        hiredCount: statusBreakdown.selected,
        statusBreakdown,
        applicationsByJob,
      },
    });
  } catch (err) {
    console.error("Recruiter dashboard error:", err.message);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};
