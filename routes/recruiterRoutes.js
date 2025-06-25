const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createReview,
  getAllReviews,
  deleteReview 
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/", getAllReviews);
router.post("/", protect, createReview);
router.delete("/:id", protect, deleteReview); 

module.exports = router;
