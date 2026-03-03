const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  markConversationRead,
  getUnreadCount,
} = require("../controllers/chatController");

router.use(protect);

router.get("/conversations", getConversations);
router.post("/conversations", getOrCreateConversation);
router.get("/conversations/:conversationId/messages", getMessages);
router.patch("/conversations/:conversationId/read", markConversationRead);
router.post("/messages", sendMessage);
router.get("/unread-count", getUnreadCount);

module.exports = router;
