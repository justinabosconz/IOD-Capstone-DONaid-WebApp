// chat.controller.js
const { ChatMessage, User } = require("../models");

async function listMessages(req, res) {
  const { itemId } = req.params;

  const messages = await ChatMessage.findAll({
    where: { itemId },
    include: [
      {
        model: User,
        as: "fromUser",
        attributes: ["id", "displayName", "email"],
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  res.json(messages);
}

async function createMessage(req, res) {
  try {
    const { itemId } = req.params;
    const { body } = req.body;

    if (!body)
      return res.status(400).json({ message: "Message body required" });

    const msg = await ChatMessage.create({
      itemId,
      fromUserId: req.user.id,
      body,
    });

    res.status(201).json(msg);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Create message failed", error: err.message });
  }
}

module.exports = { listMessages, createMessage };
