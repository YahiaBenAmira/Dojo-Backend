const { DataTypes } = require('sequelize');
const sequelize = require('../db/db.js');
const ChatRoom = require('./chatRoomModel.js');

const Message = sequelize.define("Message",{
    id: { 
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    chatroom_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    senderId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});



module.exports = Message;
