const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Message = sequelize.define(
  "Message",
  {
    content: { type: DataTypes.STRING(2000), allowNull: false },
  },
  { timestamps: true },
);

module.exports = Message;
