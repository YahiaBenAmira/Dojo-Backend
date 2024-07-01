// userChatroomModel.js
const { DataTypes } = require('sequelize');
const Sequelize = require('../db/db.js');

const UserChatroom = Sequelize.define('UserChatroom', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users', // Name of the target model
            key: 'user_id', // Key in the target model
        },
    },
    chatroom_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Chatrooms', // Name of the target model
            key: 'chatroom_id', // Key in the target model
        },
    },
});

module.exports = UserChatroom;
