// userModel.js
const { DataTypes } = require('sequelize');
const Sequelize = require('../db/db.js');

const Chatroom = require('./chatRoomModel.js');

const Task = require('./taskModel.js');
const Comment = require('./commentsModel.js')


const User = Sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('Company Manager', 'Employer'),
    },
    imageType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageData: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
});


module.exports = User;
