const router = require("express").Router();
const chats = require("../controllers/chatController");
const requireSession = require("../middleware/requireSession");

router.post("/", requireSession, chats.createOrGetChat);
router.get("/", requireSession, chats.listMyChats);
router.get("/:id/messages", requireSession, chats.getMessages);

module.exports = router;
