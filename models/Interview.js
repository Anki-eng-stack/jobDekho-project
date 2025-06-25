const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  experience: { type: String },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium"
  },
  questions: [String],
  tips: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Interview", interviewSchema);
