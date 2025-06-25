const Job = require("../models/Job");
const Review = require("../models/Review");

exports.getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // 1. Jobs posted by recruiter
    const jobs = await Job.find({ postedBy: recruiterId });

    // 2. Reviews on those jobs
    const reviews = await Review.find({})
      .populate({
        path: "job",
        populate: { path: "postedBy", select: "_id" }
      });

    // Filter only reviews for jobs posted by current recruiter
    const myReviews = reviews.filter(
      review => review.job?.postedBy?._id.toString() === recruiterId
    );

    res.json({
      message: "Recruiter dashboard data fetched successfully",
      jobsPosted: jobs,
      reviewsReceived: myReviews
    });
  } catch (err) {
    console.error("Recruiter dashboard error:", err.message);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};
