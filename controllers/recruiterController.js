const Job = require("../models/Job");
const Review = require("../models/Review");

exports.getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // 1. Jobs posted by recruiter
    // ⭐ CRITICAL CHANGE HERE: Use the correct field name from your Job model ⭐
    const jobs = await Job.find({ recruiter: recruiterId }); // Assuming your Job model has 'recruiter' field

    // 2. Reviews on those jobs
    const reviews = await Review.find({})
      .populate({
        path: "job", // Populate the 'job' field in the Review model
        // ⭐ CRITICAL CHANGE HERE (Nested Populate): Ensure 'job' refers to the Job model,
        // and then populate the correct recruiter field within the Job model.
        populate: { path: "recruiter", select: "_id" } // Assuming Job model uses 'recruiter'
      });

    // Filter only reviews for jobs posted by current recruiter
    const myReviews = reviews.filter(
      // ⭐ CRITICAL CHANGE HERE: Use the correct field name from the populated Job object ⭐
      review => review.job?.recruiter?._id.toString() === recruiterId
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