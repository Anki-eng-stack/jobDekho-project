const express = require("express");
const router = express.Router();
const {
  createReview,
  getAllReviews,
  upvoteReview,
  reportReview
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

// ✅ Only logged-in users can review/upvote/report
router.post("/", protect, createReview);
router.get("/", getAllReviews);
router.put("/:id/upvote", protect, upvoteReview);
router.put("/:id/report", protect, reportReview);

module.exports = router;
