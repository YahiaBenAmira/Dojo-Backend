const { DataTypes } = require('sequelize');
const sequelize = require('../db/db.js');


const Task = sequelize.define('Task', {
    task_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('todo', 'in Progress', 'Done'),
        allowNull: false,
        defaultValue: 'todo'
    },
    description: {
        type: DataTypes.STRING,
    },

});



module.exports = Task;
