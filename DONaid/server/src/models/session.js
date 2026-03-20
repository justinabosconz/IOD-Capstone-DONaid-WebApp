const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Session = sequelize.define(
  "Session",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  },
  { timestamps: true },
);

module.exports = Session;
