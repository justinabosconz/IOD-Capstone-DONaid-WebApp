const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Item = sequelize.define(
  "Item",
  {
    title: { type: DataTypes.STRING(120), allowNull: false },
    description: { type: DataTypes.STRING(1000) },
    category: { type: DataTypes.STRING(60) },
    condition: { type: DataTypes.STRING(60) },
    imageUrl: { type: DataTypes.STRING(400) },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "AVAILABLE",
    },
  },
  { timestamps: true },
);

module.exports = Item;
