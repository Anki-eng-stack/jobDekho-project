const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  location:    { type: String },
  salaryRange: { type: String },
  experience:  { type: String },
  company:     { type: String, required: true },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
