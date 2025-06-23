const Review = require("../models/Review");

// ✅ Create a review
exports.createReview = async (req, res) => {
  try {
    const { company, title, pros, cons, rating, jobRole, yearsWorked } = req.body;

    const review = await Review.create({
      user: req.user.id,
      company,
      title,
      pros,
      cons,
      rating,
      jobRole,
      yearsWorked,
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to submit review" });
  }
};

// ✅ Get all reviews (filter by company)
exports.getAllReviews = async (req, res) => {
  try {
    const { company } = req.query;
    const filter = company ? { company } : {};

    const reviews = await Review.find(filter).populate("user", "name role");

    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch reviews" });
  }
};

// ✅ Upvote a review
exports.upvoteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, error: "Upvote failed" });
  }
};

// ✅ Report a review
exports.reportReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { reports: 1 } },
      { new: true }
    );
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, error: "Report failed" });
  }
};
