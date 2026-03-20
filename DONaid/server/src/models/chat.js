const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Chat = sequelize.define(
  "Chat",
  {
    // itemId, userAId, userBId will be associated
  },
  { timestamps: true },
);

module.exports = Chat;
