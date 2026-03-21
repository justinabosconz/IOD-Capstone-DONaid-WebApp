const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../dbConnect");
const sequelizeInstance = dbConnect.Sequelize;

// creating the message class
class Message extends Model {}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true, // PRIMARY KEY
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    modelName: "messages",
    timestamps: true,
    freezeTableName: true,
  },
);

//exporting message model
module.exports = Message;
