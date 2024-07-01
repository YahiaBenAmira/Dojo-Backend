// associations.js
const Company = require('./models/companyModel');
const User = require('./models/userModel');
const ChatRoom = require('./models/chatRoomModel');
const Task = require('./models/taskModel');
const Comment = require('./models/commentsModel');
const Message = require('./models/messageModel');
const TaskAssignment = require('./models/TaskAssignmentmodel')
// Define associations
Company.hasMany(User, { foreignKey: 'company_id', as: 'users' });
User.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Company.hasMany(ChatRoom, { foreignKey: 'company_id' });
ChatRoom.belongsTo(Company, { foreignKey: 'company_id' });

Message.belongsTo(ChatRoom, { foreignKey: 'chatroom_id' });

Task.hasMany(Comment, { foreignKey: 'task_id' });
Comment.belongsTo(Task, { foreignKey: 'task_id' });

User.belongsToMany(Task, {
    through: TaskAssignment,
    foreignKey: 'user_id',
    otherKey: 'task_id'
  });
  Task.belongsToMany(User, {
    through: TaskAssignment,
    foreignKey: 'task_id',
    otherKey: 'user_id'
  });
  

User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

// Define many-to-many association between User and ChatRoom
User.belongsToMany(ChatRoom, { through: 'UserChatrooms', foreignKey: 'user_id' });
ChatRoom.belongsToMany(User, { through: 'UserChatrooms', foreignKey: 'chatroom_id' });

module.exports = { Company, User, ChatRoom, Task, Comment, Message,TaskAssignment };
