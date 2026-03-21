// server/tests/jest.setup.js
const { sequelize } = require("../src/models");

// Runs once before all tests
beforeAll(async () => {
  // Create tables fresh for test DB
  await sequelize.sync({ force: true });
});

// Runs after each test to keep tests isolated
afterEach(async () => {
  const models = sequelize.models;

  // Temporarily disable foreign key checks for truncation
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  for (const modelName of Object.keys(models)) {
    await models[modelName].destroy({ where: {}, truncate: true, force: true });
  }
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
});

// Runs once after all tests
afterAll(async () => {
  await sequelize.close();
});
