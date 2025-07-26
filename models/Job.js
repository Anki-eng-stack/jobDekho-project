const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String },
    description: { type: String, required: true },
    skills: {
      type: [String],
      default: []
    },
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship"],
      default: "Full-Time"
    },
    jobImage: {
      public_id: { type: String },
      url: { type: String }
    },
    // ⭐ FIX: Renamed 'postedBy' to 'recruiter' for consistency with Application & Interview models ⭐
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true // Assuming a job must always be posted by a recruiter
    }
  },
  { timestamps: true } // auto-creates createdAt and updatedAt
);

module.exports = mongoose.model("Job", jobSchema);