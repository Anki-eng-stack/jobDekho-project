const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Job = require("../models/Job");
const mongoose = require("mongoose");

const toId = (value) => {
  if (!value) return "";
  if (typeof value === "object" && value._id) return value._id.toString();
  return value.toString();
};

const ensureConversationAccess = (conversation, userId) => {
  const uid = toId(userId);
  return (
    toId(conversation.recruiterId) === uid || toId(conversation.candidateId) === uid
  );
};

exports.getOrCreateConversation = async (req, res) => {
  try {
    const { jobId, recruiterId, candidateId } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    if (!jobId) {
      return res.status(400).json({ error: "jobId is required" });
    }

    const job = await Job.findById(jobId).select("recruiter");
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const resolvedRecruiterId = recruiterId || job.recruiter?.toString();
    const resolvedCandidateId = candidateId || (role === "jobseeker" ? userId : null);
    if (!resolvedRecruiterId || !resolvedCandidateId) {
      return res.status(400).json({ error: "recruiterId and candidateId could not be resolved" });
    }

    if (
      role !== "admin" &&
      toId(userId) !== toId(resolvedRecruiterId) &&
      toId(userId) !== toId(resolvedCandidateId)
    ) {
      return res.status(403).json({ error: "Not authorized to create this conversation" });
    }

    const conversation = await Conversation.findOneAndUpdate(
      {
        jobId,
        recruiterId: resolvedRecruiterId,
        candidateId: resolvedCandidateId,
      },
      {
        $setOnInsert: {
          jobId,
          recruiterId: resolvedRecruiterId,
          candidateId: resolvedCandidateId,
        },
      },
      { new: true, upsert: true }
    )
      .populate("jobId", "title company")
      .populate("recruiterId", "name email")
      .populate("candidateId", "name email");

    res.json({ conversation });
  } catch (err) {
    res.status(500).json({ error: "Failed to create/fetch conversation", detail: err.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const conversations = await Conversation.find({
      $or: [{ recruiterId: userId }, { candidateId: userId }],
    })
      .populate("jobId", "title company")
      .populate("recruiterId", "name email")
      .populate("candidateId", "name email")
      .sort({ updatedAt: -1 });

    const conversationIds = conversations.map((c) => c._id);
    const unread = await Message.aggregate([
      {
        $match: {
          conversationId: { $in: conversationIds },
          senderId: { $ne: userObjectId },
          seenBy: { $ne: userObjectId },
        },
      },
      { $group: { _id: "$conversationId", count: { $sum: 1 } } },
    ]);
    const unreadMap = unread.reduce((acc, entry) => {
      acc[entry._id.toString()] = entry.count;
      return acc;
    }, {});

    const data = conversations.map((c) => ({
      ...c.toObject(),
      unreadCount: unreadMap[c._id.toString()] || 0,
    }));

    res.json({ conversations: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversations", detail: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    if (!ensureConversationAccess(conversation, req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized for this conversation" });
    }

    const messages = await Message.find({ conversationId })
      .populate("senderId", "name email role")
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages", detail: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    if (!conversationId || !text) {
      return res.status(400).json({ error: "conversationId and text are required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    if (!ensureConversationAccess(conversation, req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized for this conversation" });
    }

    const message = await Message.create({
      conversationId,
      senderId: req.user.id,
      text,
      seenBy: [req.user.id],
    });

    conversation.lastMessage = text;
    conversation.lastMessageAt = message.createdAt;
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate("senderId", "name email role");

    const io = req.app.get("io");
    if (io) {
      const payload = {
        message: populatedMessage,
        conversation: {
          _id: conversation._id,
          jobId: conversation.jobId,
          recruiterId: conversation.recruiterId,
          candidateId: conversation.candidateId,
          lastMessage: conversation.lastMessage,
          lastMessageAt: conversation.lastMessageAt,
          updatedAt: conversation.updatedAt,
        },
      };
      io.to(`user:${toId(conversation.recruiterId)}`).emit("chat:new-message", payload);
      io.to(`user:${toId(conversation.candidateId)}`).emit("chat:new-message", payload);
    }

    res.status(201).json({ message: populatedMessage });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message", detail: err.message });
  }
};

exports.markConversationRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    if (!ensureConversationAccess(conversation, req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized for this conversation" });
    }

    await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: req.user.id },
        seenBy: { $ne: req.user.id },
      },
      {
        $addToSet: { seenBy: req.user.id },
      }
    );

    res.json({ message: "Conversation marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark read", detail: err.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);
    const conversations = await Conversation.find({
      $or: [{ recruiterId: req.user.id }, { candidateId: req.user.id }],
    }).select("_id");
    const conversationIds = conversations.map((c) => c._id);

    const unreadCount = await Message.countDocuments({
      conversationId: { $in: conversationIds },
      senderId: { $ne: userObjectId },
      seenBy: { $ne: userObjectId },
    });

    res.json({ unreadCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unread count", detail: err.message });
  }
};
