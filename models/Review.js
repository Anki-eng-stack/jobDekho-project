const mongoose = require("mongoose");

const subRatingsSchema = new mongoose.Schema(
  {
    workCulture: { type: Number, min: 1, max: 5 },
    salaryBenefits: { type: Number, min: 1, max: 5 },
    workLifeBalance: { type: Number, min: 1, max: 5 },
    management: { type: Number, min: 1, max: 5 },
    careerGrowth: { type: Number, min: 1, max: 5 },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    headline: { type: String, trim: true, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    subRatings: { type: subRatingsSchema, default: {} },
    role: { type: String, trim: true, default: "" },
    pros: { type: String, trim: true, default: "" },
    cons: { type: String, trim: true, default: "" },
    advice: { type: String, trim: true, default: "" },
    employmentStatus: {
      type: String,
      enum: ["Current", "Former", "current", "former", ""],
      default: "",
    },
    recommends: { type: Boolean, default: null },
    ceoApproval: {
      type: String,
      enum: ["Approve", "Neutral", "Disapprove", ""],
      default: "",
    },
    isAnonymous: { type: Boolean, default: true },
    location: { type: String, trim: true, default: "" },
    industry: { type: String, trim: true, default: "" },
    logo: { type: String, trim: true, default: "" },
    helpfulVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
