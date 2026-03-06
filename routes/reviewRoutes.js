const router = require("express").Router();
const {
  createReview,
  getAllReviews,
  getCompanyReviews,
  getCompanyAISummary,
  toggleHelpfulVote,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createReview);
router.get("/", getAllReviews);
router.get("/company/:companyId", getCompanyReviews);
router.get("/company/:companyId/ai-summary", getCompanyAISummary);
router.post("/:id/helpful", protect, toggleHelpfulVote);
router.delete("/:id", protect, deleteReview);

module.exports = router;
