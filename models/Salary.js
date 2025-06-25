const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  salaryAmount: { type: Number, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Salary", salarySchema);
