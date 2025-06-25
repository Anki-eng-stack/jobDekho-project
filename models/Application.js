const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  resumeUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
