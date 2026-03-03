const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    user: { // The applicant (User) who applied
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recruiter: { // ⭐ CRITICAL: The recruiter who created the job for which the applicant is applying ⭐
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // This field MUST be provided when creating an application
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    name: String,
    email: String,
    marks: String,
    grade: String,
    experience: String,
    skills: { // Defined as an Array of Strings
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: [
        "applied",
        "under_review",
        "reviewed",
        "shortlisted",
        "interview_scheduled",
        "selected",
        "hired",
        "rejected",
        "withdrawn",
        "cancelled",
      ],
      default: "applied",
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "applied",
            "under_review",
            "reviewed",
            "shortlisted",
            "interview_scheduled",
            "selected",
            "hired",
            "rejected",
            "withdrawn",
            "cancelled",
          ],
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          default: "",
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    interview: { // Reference to the associated Interview document
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
