const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const httpServer = createServer();
const { nanoid } = require("nanoid");
// Import any necessary controllers or utilities
// const { sendMessage } = require('./controllers/chatRooms')

// Configure CORS for Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const userSocketMap = new Map();

io.on("connection", (socket) => {
  console.log(`A user connected with ID ${socket.id}`);
  authenticateUser(socket);

  function authenticateUser(socket) {
    const token = socket.handshake.auth.token;

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.user_id;
      socket.userId = userId;
      userSocketMap.set(userId.toString(), socket.id);
      console.log("User authenticated:", socket.id);
    } catch (error) {
      console.log("Authentication failed for socket:", socket.id);
      socket.disconnect();
    }
  }

  socket.on("joinPrivateRoom", ({ senderId, recipientId }) => {
    const roomId = [senderId, recipientId].sort().join("_"); // Unique room ID
    socket.join(roomId);
    console.log(`User ${senderId} joined room ${roomId}`);
  });

  // Handle sending a private message
  socket.on("privateMessage", ({ senderId, recipientId, message }) => {
    const roomId = [senderId, recipientId].sort().join("_");
    io.to(roomId).emit("receiveMessage", { senderId, message, recipientId });
    console.log(
      `Message from ${senderId} to ${recipientId} in room ${roomId}: ${message}`
    );
  });

  socket.on("joinChatroom", (chatroomId, roomName) => {
    console.log(chatroomId,roomName);
    const roomId = [chatroomId, roomName].sort().join("_");
    socket.join(roomId);
    console.log(`User joined chatroom ${roomId}`);
  });

  socket.on(
    "chatroomMessage",
    ({ chatroomId, senderId, message, roomName }) => {
      console.log('logging Upcoming Data ',
      chatroomId,
      senderId,
      message,
      roomName
            );
      const roomId = [chatroomId, roomName].sort().join("_");
      console.log('this is roomid',roomId);
      io.to(roomId).emit("receiveChatroomMessage", { senderId, message });
      console.log(`Message from ${senderId} in chatroom ${roomId}: ${message}`);
    }
  );

  // socket.on("privateMessage", (data) => {
  //   console.log("Received private message:", data);
  //   const { recipientId, message, senderSocketId } = data;
  //   const recipientSocketId = userSocketMap.get(recipientId.toString());
  //   console.log(recipientSocketId);
  //   if (recipientSocketId) {
  //     io.to(recipientSocketId).emit("privateMessage", {
  //       messageData: message,
  //       userId: senderSocketId,
  //       recipientId,
  //       type: "private",
  //     });
  //     console.log("Emitting private message:", {
  //       messageData: message,
  //       userId: senderSocketId,
  //       recipientId,
  //       type: "private",
  //     });

  //     io.to(senderSocketId).emit("privateMessage", {
  //       messageData: message,
  //       userId: senderSocketId,
  //       recipientId,
  //       type: "private",
  //     });
  //   }
  // });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

module.exports = { io, userSocketMap };
