// sync.js
const Message = require('../models/messageModel');
const PrivateMessage = require('../models/privateMessageModel');
const sequelize = require('../db/db');

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
