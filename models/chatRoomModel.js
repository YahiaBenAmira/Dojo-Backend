const { DataTypes } = require('sequelize');
const sequelize = require('../db/db.js');

const Chatroom = sequelize.define('Chatroom', {
    chatroom_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    invitationKey: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = Chatroom;
