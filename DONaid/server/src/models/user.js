const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    displayName: { type: DataTypes.STRING(80), allowNull: false },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
  });

  return User;
};
