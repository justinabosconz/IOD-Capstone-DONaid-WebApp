const router = require("express").Router();
const {
  listMessages,
  createMessage,
} = require("../controllers/chatController");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/:itemId/messages", requireAuth, listMessages);
router.post("/:itemId/messages", requireAuth, createMessage);

module.exports = router;
