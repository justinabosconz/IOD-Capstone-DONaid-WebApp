const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../config/dbConnect");
const sequelizeInstance = dbConnect.Sequelize;

// creating the chat class
class Chat extends Model {}

Chat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true, // PRIMARY KEY
    },
  },
  {
    sequelize: sequelizeInstance,
    modelName: "chats",
    timestamps: true,
    freezeTableName: true,
  },
);

//exporting chat model
module.exports = Chat;
