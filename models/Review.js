const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  company: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true } // ✅ Add this
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
