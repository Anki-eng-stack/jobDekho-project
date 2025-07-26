const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    application: { // Links to the specific application for which the interview is scheduled
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    job: { // Links to the job position
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: { // Explicitly links to the User who is the applicant
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recruiter: { // Explicitly links to the User who is the recruiter
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    mode: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    location: { // meeting link for online, address for offline
      type: String,
      required: true,
    },
    status: { // Status specifically for the interview itself
      type: String,
      enum: ["scheduled", "completed", "cancelled", "rescheduled"],
      default: "scheduled",
    },
    notes: {
      type: String,
      default: "",
    },
    jobTitle: { // Denormalized field for convenience (remember consistency implications)
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);