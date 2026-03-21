const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Session = sequelize.define("Session", {
    token: { type: DataTypes.STRING(128), allowNull: false, unique: true },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  });

  return Session;
};
