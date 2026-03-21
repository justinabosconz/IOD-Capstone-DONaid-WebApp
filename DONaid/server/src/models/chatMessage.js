const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ChatMessage = sequelize.define("ChatMessage", {
    body: { type: DataTypes.TEXT, allowNull: false },
  });

  return ChatMessage;
};
