const User = require("./user");
const Item = require("./item");
const Chat = require("./chat");
const Message = require("./message");
const Session = require("./session");

// Users <-> Items
User.hasMany(Item, { foreignKey: "ownerUserId" });
Item.belongsTo(User, { foreignKey: "ownerUserId", as: "owner" });

// Sessions
User.hasMany(Session, { foreignKey: "userId" });
Session.belongsTo(User, { foreignKey: "userId" });

// Chats
Item.hasMany(Chat, { foreignKey: "itemId" });
Chat.belongsTo(Item, { foreignKey: "itemId" });

User.hasMany(Chat, { foreignKey: "userAId", as: "chatsAsA" });
User.hasMany(Chat, { foreignKey: "userBId", as: "chatsAsB" });

// Messages
Chat.hasMany(Message, { foreignKey: "chatId" });
Message.belongsTo(Chat, { foreignKey: "chatId" });

User.hasMany(Message, { foreignKey: "senderUserId" });
Message.belongsTo(User, { foreignKey: "senderUserId", as: "sender" });

module.exports = { User, Item, Chat, Message, Session };
