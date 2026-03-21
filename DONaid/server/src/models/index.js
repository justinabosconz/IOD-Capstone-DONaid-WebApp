// Loading all models in one place

const { sequelize } = require("../dbConnect");

const UserFactory = require("./user");
const SessionFactory = require("./session");
const ItemFactory = require("./item");
const ChatMessageFactory = require("./chatMessage");

const User = UserFactory(sequelize);
const Session = SessionFactory(sequelize);
const Item = ItemFactory(sequelize);
const ChatMessage = ChatMessageFactory(sequelize);

// Associations (relationships)
User.hasMany(Item, { foreignKey: "ownerId", onDelete: "CASCADE" });
Item.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

User.hasMany(Session, { foreignKey: "userId", onDelete: "CASCADE" });
Session.belongsTo(User, { foreignKey: "userId" });

Item.hasMany(ChatMessage, { foreignKey: "itemId", onDelete: "CASCADE" });
ChatMessage.belongsTo(Item, { foreignKey: "itemId" });

User.hasMany(ChatMessage, { foreignKey: "fromUserId", onDelete: "CASCADE" });
ChatMessage.belongsTo(User, { foreignKey: "fromUserId", as: "fromUser" });

module.exports = { sequelize, User, Session, Item, ChatMessage };
