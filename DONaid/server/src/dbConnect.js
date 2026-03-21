// server/src/config/db.js
const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");

// Load .env.test when NODE_ENV=test, else load normal .env
const envFile =
  process.env.NODE_ENV === "test"
    ? path.join(process.cwd(), ".env.test")
    : path.join(process.cwd(), ".env");

if (fs.existsSync(envFile)) {
  require("dotenv").config({ path: envFile });
} else {
  require("dotenv").config();
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: false,
  },
);

module.exports = { sequelize };
