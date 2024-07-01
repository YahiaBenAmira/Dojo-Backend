const User = require("../models/userModel");
const Task = require("../models/taskModel");
const Comment = require("../models/commentsModel");

module.exports.createTaskMsg = async (req, res) => {
  const { content, user_id } = req.body;
  const { task_id } = req.params;

  console.log("Request Body:", req.body);
  console.log("Request Params:", req.params);

  try {
    // Validate inputs
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    } else if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Check if the task exists
    console.log("Task ID:", task_id);
    const task = await Task.findOne({ where: { task_id } });
    console.log("Found Task:", task);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if the user exists
    const user = await User.findOne({ where: { user_id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the comment
    const comment = await Comment.create({
      content,
      task_id,
      user_id,
    });

    return res
      .status(201)
      .json({ message: "Comment created successfully", comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the comment" });
  }
};

module.exports.getCommentsForTask = async (req, res) => {
  const { task_id } = req.params;
  try {
    const comments = await Comment.findAll({
      where: {
        task_id: task_id,
      },
      include: [
        {
          model: User,
          attributes: ["user_id", "firstName", "lastName", "imageData"], // Include necessary user attributes
        },
      ],
    });

    if (!comments.length) {
      return res.status(404).json({
        success: false,
        message: "No comments found for the specified task",
      });
    }

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving comments",
      error: error.message,
    });
  }
};
