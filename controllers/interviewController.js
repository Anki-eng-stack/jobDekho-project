const Interview = require("../models/Interview");

exports.createInterview = async (req, res) => {
  try {
    const { company, role, experience, difficulty, questions, tips } = req.body;

    const interview = await Interview.create({
      company,
      role,
      experience,
      difficulty,
      questions,
      tips,
      postedBy: req.user.id
    });

    res.status(201).json({ message: "Interview added", interview });
  } catch (err) {
    res.status(500).json({ error: "Failed to add interview", detail: err.message });
  }
};

exports.getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().populate("postedBy", "name email role");
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch interviews" });
  }
};
exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate("postedBy", "name email");
    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }
    res.json(interview);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch interview", detail: err.message });
  }
};
exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    // Optional: Only allow the user who posted it or admin to delete
    if (interview.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to delete this interview" });
    }

    await interview.deleteOne();
    res.json({ message: "Interview deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete interview", detail: err.message });
  }
};
