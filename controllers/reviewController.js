const Review = require("../models/Review");

exports.createReview = async (req, res) => {
  try {
    const { company, rating, review } = req.body;

    const newReview = await Review.create({
      company,
      rating,
      review,
      user: req.user.id
    });

    res.status(201).json({ message: "Review posted", newReview });
  } catch (err) {
    res.status(500).json({ error: "Failed to post review" });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user", "name role");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ error: "Review not found" });

    // Only the user who posted the review or an admin can delete it
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Delete review error:", err.message);
    res.status(500).json({ error: "Failed to delete review" });
  }
};
