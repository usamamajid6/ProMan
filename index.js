const cors = require("cors");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const morgan = require("morgan");
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
const Notification = require("./Routes/NotificationRoutes");

// API Imports
const TaskAPI = require("./API/TaskAPI");

app.use(express.json());
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use("/AttachmentUploads", express.static("AttachmentUploads"));
app.use("/DPUploads", express.static("DPUploads"));
connectToDB();
require("./socketIO")(io);
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
app.use(Notification);

app.get("/", (req, res) => {
  console.log("====================================");
  console.log(req.body);
  console.log("====================================");
  res.json({
    status: true,
    message: "Last Commit At 09:34 PM At August 04",
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
