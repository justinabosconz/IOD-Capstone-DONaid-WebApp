const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../config/dbConnect");
const sequelizeInstance = dbConnect.Sequelize;

// creating the item class
class Item extends Model {}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true, // PRIMARY KEY
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    condition: {
      type: DataTypes.STRING,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "AVAIALBLE",
    },
  },
  {
    sequelize: sequelizeInstance,
    modelName: "items",
    timestamps: true,
    freezeTableName: true,
  },
);

//exporting item model
module.exports = Item;
