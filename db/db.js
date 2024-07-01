const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('Dojo', 'postgres', '22557787', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
});
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or synchronize models:', error);
  }
})();

module.exports = sequelize;
