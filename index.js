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
const Emailer = require("./Email");

// API Imports

const TaskAPI = require("./API/TaskAPI");
const TeamAPI = require("./API/TeamAPI");

app.use(express.json());
app.use(cors());

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

  socket.on("disconnect", () => console.log("Client disconnected"));
});

app.get("/", (req, res) => {
  res.json({
    Message: "Last Commit At 8:20 PM At July 12",
  });
});

server.listen(PORT, (e) => {
  console.log(`Server started at Port # ${PORT}`);
});
console.log(new Date());

// Send Notofication For Task Due in 30 Mins, 3 Hours, 6 Hours, 12 Hours, 1 Day Via E-mail

// setInterval(async () => {
//   let result = await TaskAPI.getTasksBeforeDueDate(5);
//   console.log("====================================");
//   console.log(result);
//   console.log("====================================");
// }, 10000);

const m = async () => {
  let result = await TaskAPI.getTasksBeforeDueDate(5);
  console.log("====================================");
  console.log(result);
  console.log("====================================");
};

m();
