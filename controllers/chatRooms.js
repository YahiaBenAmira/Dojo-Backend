const { nanoid } = require("nanoid");
const ChatRoom = require("../models/chatRoomModel");
const User = require("../models/userModel");
const UserChatroom = require("../models/userChatroomModel");
const PrivateMessage = require("../models/privateMessageModel");
const Message = require("../models/messageModel");
const { io, userSocketMap } = require("../socket");
const multer = require("multer");
const fs = require("fs");

module.exports.createChatRoom = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { name } = req.body;
    const invitationCode = nanoid(10);
    const chatroom = await ChatRoom.create({
      name,
      company_id,
      invitationKey: invitationCode,
    });
    res.status(201).json({
      data: chatroom,
      success: true,
    });
    io.emit("chatroom created", chatroom);
  } catch (error) {
    res.status(400).json({
      success: false,
      errormessage: error,
    });
  }
};

module.exports.JunctionAll = async (req, res) => {
  const { chatroom_id, user_id } = req.body;

  try {
    if (chatroom_id != null) {
      const chatroom = await ChatRoom.findByPk(chatroom_id, { include: User });

      if (!chatroom) {
        return res.status(404).json({
          success: false,
          message: "Chatroom not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: chatroom,
      });
    } else if (user_id != null) {
      const user = await User.findByPk(user_id, { include: ChatRoom });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Either chatroom_id or user_id must be provided.",
      });
    }
  } catch (error) {
    console.error("Error in JunctionAll function:", error);
    return res.status(500).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

module.exports.joinChatRoom = async (req, res) => {
  const { user_id, invitation_key } = req.params;
  try {
    // Check if the user and chatroom exist
    const user = await User.findByPk(user_id);
    const chatroom = await ChatRoom.findOne({
      where: { invitationKey: invitation_key },
    });
    if (!user || !chatroom) {
      throw new Error("User or chatroom not found");
    }

    // Validate the chatroom's validation code
    if (chatroom.validationCode !== req.body.validationCode) {
      throw new Error("Invalid validation code for chatroom");
    }

    // Add the user to the chatroom
    await UserChatroom.create({
      user_id: user_id,
      chatroom_id: chatroom.chatroom_id,
    });

    res.status(201).json({
      success: true,
      data: { user, chatroom },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

module.exports.getUserChatRoom = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await User.findByPk(user_id, {
      include: {
        model: ChatRoom,
        through: { attributes: [] }, // Exclude join table attributes
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      data: user.Chatrooms, // Return an array of chatrooms
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

module.exports.userChatRooms = async (req, res) => {
  const { chatroom_id } = req.params;
  
  try {
    // Fetch user IDs associated with the chatroom
    const userChatroom = await UserChatroom.findAll({
      where: {
        chatroom_id: chatroom_id,
      },
    });

    // Extract user IDs from userChatroom
    const userIds = userChatroom.map(u => u.user_id);
    const chatroomId = userChatroom.map(u => u.chatroom_id)
    // Fetch user details using the extracted user IDs
    const users = await User.findAll({
      where: {
        user_id: userIds
      }
    });
    const chatroom = await ChatRoom.findAll({where:{
      chatroom_id: chatroomId
    }})
    res.status(200).json({
      success: true,
      data: {users,chatroom} // Assuming you want to return user details
    });
  } catch (error) {
    console.error("Error fetching user chatrooms:", error);
    res.status(400).json({
      success: false,
      errorMessage: error.message // Send back error message
    });
  }
};

module.exports.inviteToChatroom = async (req, res) => {
  const { inviter_id, invited_user_id, invitation_key } = req.params;
  try {
    const inviter = await User.findByPk(inviter_id);
    const invitedUser = await User.findByPk(invited_user_id);
    const chatroom = await ChatRoom.findOne({
      where: { invitationKey: invitation_key },
    });
    if (!inviter || !invitedUser || !chatroom) {
      throw new Error("Inviter, invited user, or chatroom not found");
    }
    await invitedUser.addChatroom(chatroom);
    res.status(201).json({
      success: true,
      data: invitedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      errorMessage:
        error instanceof Error ? error.message : "An error occurred",
    });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("audio");

module.exports.sendChatRoomMessage = async (req, res) => {
  try {
    await handleUpload(req, res);
    const { chatroomId, userId, message, senderId } = req.body;
    console.log(req.body);
    const chatroom = await ChatRoom.findByPk(chatroomId);
    if (!chatroom) {
      throw new Error("Chatroom not found");
    }

    if (req.file) {
      sendAudioMessage({
        chatroomId,
        userId,
        audioData: req.file.path,
        senderSocketId,
        type: "global",
      }); // Include type for global audio message
    }
    const newMessage = await Message.create({
      chatroom_id: chatroomId,
      senderId: userId,
      message: message,
    });
    res.status(201).json({
      success: true,
      data: {
        senderId,
        chatroomId,
        message,
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(400).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

async function handleUpload(req, res) {
  return new Promise((resolve, reject) => {
    upload(req, res, function (err) {
      if (err) {
        console.error("Error uploading audio file:", err);
        reject(new Error("Error uploading audio file"));
      }
      resolve();
    });
  });
}

function sendAudioMessage(data) {
  console.log("Sending audio message:", data);
  const audioData = fs.readFileSync(data.audioData);
  io.emit("audioMessage", { ...data, audioData });
  fs.unlinkSync(data.audioData);
}

module.exports.SendingPrivateMessage = async (req, res) => {
  try {
    await handleUpload(req, res);
    const { message, senderId, recipientId } = req.body;
    console.log(req.body);
    if (!recipientId) {
      console.log(`Recipient with ID ${recipientId} not found`);
    }
    const privateMessage = await PrivateMessage.create({
      senderId,
      recipientId,
      message,
    });
    res.status(200).json({
      success: true,
      data: {
        message,
        senderId,
        recipientId,
      },
    });
  } catch (error) {
    console.error("Error sending private message:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
