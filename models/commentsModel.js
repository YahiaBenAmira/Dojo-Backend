const { DataTypes } = require('sequelize');
const sequelize = require('../db/db.js');


const Comment = sequelize.define('Comment', {
    comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    task_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
   
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Comment;
