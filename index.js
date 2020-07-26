const cors = require("cors");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
const PORT = 2222 || process.env.PORT;
const { connectToDB } = require("./connectToDB.js");
const User = require("./Routes/UserRoutes");
const Project = require("./Routes/ProjectRoutes");
const Attachment = require("./Routes/AttachmentRoutes");
const Comment = require("./Routes/CommentRoutes");
const SubTask = require("./Routes/SubTaskRoutes");
const TaskList = require("./Routes/TaskListRoutes");
const Task = require("./Routes/TaskRoutes");
const Team = require("./Routes/TeamRoutes");
const Timeline = require("./Routes/TimelineRoutes");
const Chat = require("./Routes/ChatRoutes");
// const Emailer = require("./Email");
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// API Imports
const TaskAPI = require("./API/TaskAPI");
// const AttachmentAPI = require("./API/AttachmentAPI");
const ChatAPI = require("./API/ChatAPI.js");
const jwt = require("jsonwebtoken");
const JWTKey = require("./JWTKey");
app.use(express.json());
app.use(cors());
app.use(express.static('uploads'))

connectToDB();

app.use(Attachment);
app.use(Comment);
app.use(User);
app.use(Timeline);
app.use(Team);
app.use(Task);
app.use(TaskList);
app.use(SubTask);
app.use(Project);
app.use(Chat);

io.on("connection", (socket) => {
  socket.emit("fromServer", { data: "s" });
  // Project Room Joining
  socket.on("joinTheProjectRoom", (data) => {
    const room_name = "roomForProject#" + data._id;

    socket.join(room_name);
  });
  // Project Room Leaving
  socket.on("leaveTheProjectRoom", (data) => {
    const room_name = "roomForProject#" + data._id;

    socket.leave(room_name);
  });
  // For updating Project Data
  socket.on("tellRoomMatesToUpdateProject", (data) => {
    const room_name = "roomForProject#" + data._id;
    io.to(room_name).emit("updateProjectData");
  });

  // Task Room
  socket.on("joinTheTaskRoom", (data) => {
    const room_name = "roomForTask#" + data._id;

    socket.join(room_name);
  });
  socket.on("leaveTheTaskRoom", (data) => {
    const room_name = "roomForTask#" + data._id;

    socket.leave(room_name);
  });
  socket.on("tellRoomMatesToUpdateTask", (data) => {
    const room_name = "roomForTask#" + data._id;
    io.to(room_name).emit("updateTaskData");
  });

  // Add Chat
  socket.on("addChatMessageToProject", async (data) => {
    const room_name = "roomForProject#" + data.project_id;
    const result = await ChatAPI.createNewChat(
      data.message,
      data.member_id,
      data.project_id
    );
    io.to(room_name).emit("updateChatsData", result);
  });
  socket.on("disconnect", () => console.log("Client disconnected"));
});

app.get("/", (req, res) => {
  res.json({
    Message: "Last Commit At 9:00 PM At July 26",
  });
});

server.listen(PORT, (e) => {
  console.log(`Server started at Port # ${PORT}`);
});
console.log(new Date());

// Send Notofication For Task Due in 30 Mins, 6 Hours, 12 Hours, 1 Day Via E-mail

setInterval(async () => {
  await TaskAPI.notifyUsersWhoseTasksDueDateInOneHour();
  await TaskAPI.notifyUsersWhoseTasksDueDateInSixHour();
  await TaskAPI.notifyUsersWhoseTasksDueDateInTwelveHour();
  await TaskAPI.notifyUsersWhoseTasksDueDateInOneDay();
}, 1000);

// TaskAPI.getTasksInHierarchy(1);

var token =  jwt.sign({ foo: 'bar' }, JWTKey);
console.log("====================================");
console.log(token);
console.log("====================================");
