const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../config/dbConnect");
const sequelizeInstance = dbConnect.Sequelize;

// creating the session class
class Session extends Model {}

Session.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true, // PRIMARY KEY
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    modelName: "sessions",
    timestamps: true,
    freezeTableName: true,
  },
);

//exporting session model
module.exports = Session;
