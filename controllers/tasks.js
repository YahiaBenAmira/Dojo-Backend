const { where } = require("sequelize");
const Tasks = require("../models/taskModel");
const User = require('../models/userModel')
const TaskAssignment = require('../models/TaskAssignmentmodel');

module.exports.CreateTask = async (req, res) => {
  const { title, description} = req.body;
  try {
    const task = await Tasks.create({
      title,
      description,
      status: 'todo'
    });
    res.status(201).json({
      success: true,
      data: {
        task,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

module.exports.GetAllTasks = async (req, res) => {
  try {
    const tasks = await Tasks.findAll();

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch tasks", error: error.message });
  }
};

module.exports.UpdateTaskStatus = async (req, res) => {
  const { task_id } = req.params;
  const { status } = req.body;
  console.log(req.body);
  try {
    // Find the task by task_id
    const task = await Tasks.findOne({ where: { task_id } });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Failed to find task by that id",
      });
    }

    // Update the status of the task
    await Tasks.update({ status }, { where: { task_id } });

    // Refetch the updated task
    const updatedTask = await Tasks.findOne({ where: { task_id } });

    res.status(200).json({
      success: true,
      message: `Task updated successfully!`,
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the task",
    });
  }
};


module.exports.AssignTaskToUser = async (req, res) => { 
  const { user_id } = req.body;
  const { task_id } = req.params;

  console.log(req.body);
  console.log(req.params);
  
  try { 
    const user = await User.findOne({
      where: { 
        user_id: user_id
      }
    });
    
    const task = await Tasks.findOne({
      where: { 
        task_id: task_id
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User by specified id not found"
      });
    }

    if (!task) {
      return res.status(400).json({
        success: false,
        message: "Task by specified id not found"
      });
    }

    await TaskAssignment.create({
      user_id: user_id,
      task_id: task_id
    });

    res.status(200).json({
      success: true,
      message: "Task assigned successfully"
    });
  } catch (error) { 
    res.status(400).json({
      success: false,
      message: error.message 
    });
  }
}

module.exports.RetrieveAssignedUsers = async (req, res) => { 
  const { task_id } = req.params;

  try { 
    const task = await Tasks.findOne({
      where: { 
        task_id: task_id
      },
      include: {
        model: User,
        through: {
          attributes: []
        }
      }
    });

    if (!task) { 
      return res.status(400).json({
        success: false,
        message: "No Task found"
      });
    }

    const assignedUsers = task.Users;

    res.status(200).json({
      success: true,
      users: assignedUsers
    });

  } catch (error) { 
    res.status(400).json({
      success: false,
      message: error.message 
    });
  }
};