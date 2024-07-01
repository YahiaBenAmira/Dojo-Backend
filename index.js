require("dotenv").config();
const express = require("express");
const path = require("path");
const http = require("http");
const bodyParser = require('body-parser');
const Chat = require("./models/chatRoomModel");
const { Task, Comment, User,Company,ChatRoom } = require('./associations');

const db = require("./db/db");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const chatRouter = require("./routes/chatRooms");
const userRouter = require("./routes/userAuth");
const taskRouter = require("./routes/tasks");
const taskMsgRouter = require('./routes/tasksMessages')
const companyRouter = require('./routes/company')

const { io } = require("./socket");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/user/", (req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

app.use("/api/tasks/", taskRouter);
app.use("/api/chat/", chatRouter);
app.use("/api/user/", userRouter);
app.use("/api/tasks/utils/",taskMsgRouter)
app.use("/api/company/",companyRouter)
io.attach(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

// Log Socket.io connection information
