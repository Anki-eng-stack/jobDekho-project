const Interview = require("../models/Interview");
const Application = require("../models/Application");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { sendInterviewUpdateEmail } = require("../utils/sendEmail");

const normalizeStatus = (status) => {
  const value = String(status || "").toLowerCase().trim();
  if (value === "reviewed" || value === "under_review") return "shortlisted";
  if (value === "hired") return "selected";
  if (value === "cancelled") return "withdrawn";
  return value;
};

const pushHistory = (application, status, changedBy, note = "") => {
  const normalized = normalizeStatus(status);
  application.statusHistory = application.statusHistory || [];
  const last = application.statusHistory[application.statusHistory.length - 1];
  if (last && last.status === normalized) return;
  application.statusHistory.push({
    status: normalized,
    date: new Date(),
    note,
    changedBy: changedBy || undefined,
  });
};

const emitStatusUpdate = (req, application) => {
  const io = req.app.get("io");
  if (!io || !application) return;

  const payload = {
    applicationId: application._id,
    jobId: application.job?._id || application.job,
    userId: application.user?._id || application.user,
    recruiterId: application.recruiter?._id || application.recruiter || application.job?.recruiter,
    status: normalizeStatus(application.status),
    statusHistory: (application.statusHistory || []).map((entry) => ({
      status: normalizeStatus(entry.status),
      date: entry.date,
      note: entry.note || "",
      changedBy: entry.changedBy,
    })),
    updatedAt: application.updatedAt || new Date(),
  };

  if (payload.userId) io.to(`user:${payload.userId.toString()}`).emit("application:status-updated", payload);
  if (payload.recruiterId) io.to(`user:${payload.recruiterId.toString()}`).emit("application:status-updated", payload);
};

exports.createInterview = async (req, res) => {
  try {
    const { date, mode, location, notes } = req.body;
    const applicationId = req.body.applicationId || req.body.application;
    const recruiterId = req.user.id;

    if (!applicationId) {
      return res.status(400).json({ error: "applicationId is required" });
    }

    const application = await Application.findById(applicationId).populate("job user");
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.job.recruiter.toString() !== recruiterId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to schedule an interview for this job." });
    }

    const interview = await Interview.create({
      application: application._id,
      job: application.job._id,
      applicant: application.user._id,
      recruiter: recruiterId,
      date,
      mode,
      location,
      notes,
      jobTitle: application.job.title,
    });

    application.status = "interview_scheduled";
    pushHistory(application, "interview_scheduled", recruiterId, "Interview scheduled");
    application.interview = interview._id;
    await application.save();
    emitStatusUpdate(req, application);

    const conversation = await Conversation.findOneAndUpdate(
      {
        jobId: application.job._id,
        recruiterId: application.job.recruiter,
        candidateId: application.user._id,
      },
      {
        $setOnInsert: {
          jobId: application.job._id,
          recruiterId: application.job.recruiter,
          candidateId: application.user._id,
        },
      },
      { new: true, upsert: true }
    );

    const systemText = `Interview scheduled for ${new Date(interview.date).toLocaleString()} (${interview.mode}).`;
    const systemMessage = await Message.create({
      conversationId: conversation._id,
      senderId: recruiterId,
      text: systemText,
      seenBy: [recruiterId],
    });

    conversation.lastMessage = systemText;
    conversation.lastMessageAt = systemMessage.createdAt;
    await conversation.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`user:${application.job.recruiter.toString()}`).emit("chat:new-message", {
        message: systemMessage,
        conversationId: conversation._id,
      });
      io.to(`user:${application.user._id.toString()}`).emit("chat:new-message", {
        message: systemMessage,
        conversationId: conversation._id,
      });
    }

    res.status(201).json({ message: "Interview scheduled successfully", interview });
  } catch (err) {
    console.error("Interview scheduling error:", err);
    res.status(500).json({ error: "Failed to schedule interview", detail: err.message });
  }
};

exports.getAllInterviews = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === "recruiter") {
      query.recruiter = req.user.id;
    }

    const interviews = await Interview.find(query)
      .populate("job", "title company")
      .populate("applicant", "name email")
      .populate("recruiter", "name email");

    res.json({ interviews });
  } catch (err) {
    console.error("Get all interviews error:", err);
    res.status(500).json({ error: "Failed to fetch interviews", detail: err.message });
  }
};

exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate("job", "title company")
      .populate("applicant", "name email")
      .populate("recruiter", "name email");

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    const recruiterId = interview.recruiter?._id
      ? interview.recruiter._id.toString()
      : interview.recruiter.toString();
    const applicantId = interview.applicant?._id
      ? interview.applicant._id.toString()
      : interview.applicant.toString();

    const isAuthorizedRecruiter = recruiterId === req.user.id;
    const isAuthorizedApplicant = applicantId === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAuthorizedRecruiter && !isAuthorizedApplicant && !isAdmin) {
      return res.status(403).json({ error: "Not authorized to view this interview" });
    }

    res.json(interview);
  } catch (err) {
    console.error("Get interview by ID error:", err);
    res.status(500).json({ error: "Failed to fetch interview", detail: err.message });
  }
};

exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    if (interview.recruiter.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to delete this interview" });
    }

    await interview.deleteOne();

    const application = await Application.findById(interview.application);
    if (application) {
      application.interview = null;
      if (application.status === "interview_scheduled") {
        application.status = "shortlisted";
        pushHistory(application, "shortlisted", req.user.id, "Interview removed; moved back to shortlisted");
      }
      await application.save();
      emitStatusUpdate(req, application);
    }

    res.json({ message: "Interview deleted successfully" });
  } catch (err) {
    console.error("Delete interview error:", err);
    res.status(500).json({ error: "Failed to delete interview", detail: err.message });
  }
};

exports.getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ applicant: req.user.id })
      .populate("job", "title company")
      .populate("recruiter", "name email")
      .sort({ date: 1 });

    res.json({ interviews });
  } catch (err) {
    console.error("Fetch My Interviews error:", err);
    res.status(500).json({ error: "Failed to fetch interviews", detail: err.message });
  }
};

exports.updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate("applicant", "name email")
      .populate("job", "title");

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    const recruiterId = interview.recruiter?._id
      ? interview.recruiter._id.toString()
      : interview.recruiter.toString();
    if (recruiterId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to update this interview" });
    }

    const { date, mode, location, notes, status } = req.body;
    const oldDate = interview.date;
    const oldDateIso = oldDate ? new Date(oldDate).toISOString() : "";
    const newDateIso = date ? new Date(date).toISOString() : oldDateIso;
    const isTimeChanged = Boolean(date) && oldDateIso !== newDateIso;

    if (date) interview.date = date;
    if (mode) interview.mode = mode;
    if (location) interview.location = location;
    if (notes) interview.notes = notes;
    if (status) interview.status = status;

    await interview.save();

    let notificationSent = false;
    if (isTimeChanged && interview.applicant?.email) {
      try {
        await sendInterviewUpdateEmail({
          to: interview.applicant.email,
          applicantName: interview.applicant.name,
          jobTitle: interview.job?.title || interview.jobTitle,
          oldDate,
          newDate: interview.date,
          mode: interview.mode,
          location: interview.location,
          notes: interview.notes,
        });
        notificationSent = true;
      } catch (mailErr) {
        console.error("Failed to send interview update notification:", mailErr.message);
      }
    }

    if (isTimeChanged) {
      try {
        const conversation = await Conversation.findOne({
          jobId: interview.job?._id || interview.job,
          recruiterId: interview.recruiter,
          candidateId: interview.applicant?._id || interview.applicant,
        });
        if (conversation) {
          const systemText = `Interview time updated to ${new Date(interview.date).toLocaleString()}.`;
          const systemMessage = await Message.create({
            conversationId: conversation._id,
            senderId: req.user.id,
            text: systemText,
            seenBy: [req.user.id],
          });
          conversation.lastMessage = systemText;
          conversation.lastMessageAt = systemMessage.createdAt;
          await conversation.save();

          const io = req.app.get("io");
          if (io) {
            io.to(`user:${conversation.recruiterId.toString()}`).emit("chat:new-message", {
              message: systemMessage,
              conversationId: conversation._id,
            });
            io.to(`user:${conversation.candidateId.toString()}`).emit("chat:new-message", {
              message: systemMessage,
              conversationId: conversation._id,
            });
          }
        }
      } catch (systemErr) {
        console.error("Failed to send system chat message for interview update:", systemErr.message);
      }
    }

    res.json({ message: "Interview updated successfully", interview, notificationSent });
  } catch (err) {
    console.error("Update interview error:", err);
    res.status(500).json({ error: "Failed to update interview", detail: err.message });
  }
};
