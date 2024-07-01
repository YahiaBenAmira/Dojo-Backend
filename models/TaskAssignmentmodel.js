const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const User = require('./userModel')
const Task = require('./taskModel')

const TaskAssignment = sequelize.define('TaskAssignment', {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'user_id'
      }
    },
    task_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Task,
        key: 'task_id'
      }
    }
  });

  module.exports = TaskAssignment