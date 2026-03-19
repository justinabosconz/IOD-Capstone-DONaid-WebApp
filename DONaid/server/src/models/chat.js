const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../config/db");
const sequelizeInstance = dbConnect.Sequelize;

// creating the chat class
class Chat extends Model {}

Chat.init(
  {},
  {
    sequelize: sequelizeInstance,
    modelName: "chats",
    timestamps: true,
    freezeTableName: true,
  },
);

//exporting chat model
module.exports = Chat;
