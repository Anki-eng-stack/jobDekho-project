const router = require("express").Router();
const { createReview, getAllReviews,deleteReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createReview); // User required
router.get("/", getAllReviews);  
        // Public

module.exports = router;
