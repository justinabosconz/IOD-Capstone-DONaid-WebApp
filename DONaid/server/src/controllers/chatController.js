const { Op } = require("sequelize");
const { Chat, Message, Item, User } = require("../models");

function sortedPair(a, b) {
  return a < b ? [a, b] : [b, a];
}

exports.createOrGetChat = async (req, res, next) => {
  try {
    const { itemId, otherUserId } = req.body;
    if (!itemId || !otherUserId)
      return res.status(400).json({ message: "Missing fields" });
    const [userAId, userBId] = sortedPair(req.user.id, Number(otherUserId));

    let chat = await Chat.findOne({ where: { itemId, userAId, userBId } });
    if (!chat) chat = await Chat.create({ itemId, userAId, userBId });

    res.status(201).json(chat);
  } catch (err) {
    next(err);
  }
};

exports.listMyChats = async (req, res, next) => {
  try {
    const myId = req.user.id;
    const chats = await Chat.findAll({
      where: { [Op.or]: [{ userAId: myId }, { userBId: myId }] },
      include: [
        {
          model: Item,
          include: [
            { model: User, as: "owner", attributes: ["id", "displayName"] },
          ],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });
    res.json(chats);
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const messages = await Message.findAll({
      where: { chatId },
      include: [
        { model: User, as: "sender", attributes: ["id", "displayName"] },
      ],
      order: [["createdAt", "ASC"]],
    });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};
