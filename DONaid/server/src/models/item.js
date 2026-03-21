const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Item = sequelize.define("Item", {
    title: { type: DataTypes.STRING(120), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING(60), allowNull: true },
    itemCondition: { type: DataTypes.STRING(60), allowNull: true },
    imagePath: { type: DataTypes.STRING(255), allowNull: true }, // saved filename path
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "AVAILABLE",
    },
  });

  return Item;
};
