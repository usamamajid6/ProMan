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
  socket.on("joinTheProjectRoom", (data) => {
    const room_name = "roomForProject#" + data._id;

    socket.join(room_name);
  });
  socket.on("leaveTheProjectRoom", (data) => {
    const room_name = "roomForProject#" + data._id;

    socket.leave(room_name);
  });
  socket.on("tellRoomMatesToUpdateProject", (data) => {
    const room_name = "roomForProject#" + data._id;
    io.to(room_name).emit("updateProjectData");
  });
  socket.on("disconnect", () => console.log("Client disconnected"));
});

app.get("/", (req, res) => {
  res.json({
    Message: "Last Commit At 2:46 PM At July 8",
  });
});

server.listen(PORT, (e) => {
  console.log(`Server started at Port # ${PORT}`);
});

const test = async () => {
  console.log("----------------------Working!----------------------");
  const user = await new UserSchema({ _id: 4, name: "ss" });
  const result = await UserSchema.create(user);
  if (result) {
    console.log("-----------------Yeeeeessss Success!----------------");
  }
  console.log("----------------------Working!----------------------");
};

var today = new Date();
var Christmas = new Date("2020-07-10T08:15:34.316Z");
console.log(Christmas);
var diffMs;
if (today > Christmas) {
  diffMs = today - Christmas; // milliseconds between now & Christmas
} else {
  diffMs = Christmas - today; // milliseconds between now & Christmas
}

var diffDays = Math.floor(diffMs / 86400000); // days
var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
let totalMins =
  Math.abs(diffDays) * 24 * 60 + Math.abs(diffHrs) * 60 + Math.abs(diffMins);
console.log(
  diffDays +
    " days, " +
    diffHrs +
    " hours, " +
    diffMins +
    " minutes until Christmas 2009 =)"
);
console.log("Total Minutes equals to ", totalMins);

// let members = [
//   {
//     _id: 1,
//     name: "Member A",
//   },
//   {
//     _id: 2,
//     name: "Member B",
//   },
//   {
//     _id: 3,
//     name: "Member C",
//   },
//   {
//     _id: 4,
//     name: "Member D",
//   },
// ];

// let addMembers = [
//   {
//     _id: 5,
//     name: "Member E",
//   },
//   {
//     _id: 6,
//     name: "Member F",
//   },
//   {
//     _id: 3,
//     name: "Member C",
//   },
//   {
//     _id: 4,
//     name: "Member D",
//   },
// ];

// let newArray = [
//   {
//     _id: 1,
//     name: "Member A",
//   },
//   {
//     _id: 2,
//     name: "Member B",
//   },
//   {
//     _id: 3,
//     name: "Member C",
//   },
//   {
//     _id: 4,
//     name: "Member D",
//   },
// ];

// const ifPresent = (array, _id) => {
//   let found = false;
//   for (let i = 0; i < array.length; i++) {
//     if (array[i]._id === _id) {
//       found = true;
//       break;
//     }
//   }
//   return found;
// };

// for (let i = 0; i < addMembers.length; i++) {
//   const element = addMembers[i];
//   if (!ifPresent(newArray, element._id)) {
//     newArray.push(element);
//   }
// }

// console.log("====================================");
// console.log(newArray);
// console.log("====================================");

// //<------------------User------------------>
// app.post("/registerUser", User);
// app.post("/loginUser", User);
// app.post("/getUser", User);
// app.get("/getAllUsers", User);
// app.put("/updateUser", User);
// app.post("/addProject", User);
// app.put("/updateTTAES", User); //updateTotalTasksAndEfficiencyScore
// app.post("/test", User);
// //<----------------End User---------------->
// ////////////////////////////////////////////
// //<-----------------Project---------------->
// app.post("/createNewProject", Project);
// app.post("/getProjectById", Project);
// app.put("/updateProjectLeader", Project);
// app.put("/updateProjectStatus", Project);
// app.put("/updateProjectType", Project);
// app.put("/updateProjectCost", Project);
// app.put("/addMemberToProject", Project);
// app.put("/updateTTAESOfMIProject", Project);
// app.put("/addMultipleMemberToProject", Project);
// //<---------------End Project-------------->
// ////////////////////////////////////////////
// //<---------------Attachment--------------->
// app.post("/createNewAttachment", Attachment);
// app.post("/getAttachmentById", Attachment);
// //<-------------End Attachment------------->
// ////////////////////////////////////////////
// //<----------------Comment----------------->
// app.post("/createNewComment", Comment);
// app.post("/getCommentById", Comment);
// //<--------------End Comment--------------->
// ////////////////////////////////////////////
// //<----------------SubTask----------------->
// app.post("/createNewSubTask", SubTask);
// app.post("/getSubTaskById", SubTask);
// app.put("/updateSubTaskStatus", SubTask);
// //<--------------End SubTask--------------->
// ////////////////////////////////////////////
// //<---------------TaskList----------------->
// // app.post("/createNewTaskList", TaskList);
// // app.post("/getTaskListById", TaskList);
// app.use(TaskList);
// //<-------------End TaskList--------------->
// ////////////////////////////////////////////
// //<-----------------Task------------------->
// app.post("/createNewTask", Task);
// app.post("/getTaskById", Task);
// app.put("/updateTaskStatus", Task);
// //<---------------End Task----------------->
// ////////////////////////////////////////////
// //<-----------------Team------------------->
// app.post("/createNewTeam", Team);
// app.post("/getTeamById", Team);
// //<---------------End Team----------------->
// ////////////////////////////////////////////
// //<---------------Timeline----------------->
// app.post("/createNewTimeline", Timeline);
// app.post("/getTimelineById", Timeline);
// //<-------------End Timeline--------------->
// ////////////////////////////////////////////
const result = [
  {
    project: 1,
    tasks: [
      {
        _id: 6,
        name: "Task 4",
        description: "hg hgh hg hg",
        pre_req: 0,
        task_list: 1,
        status: "in-progress",
        attachments: [],
        comments: [],
        members: [1, 2],
        sub_tasks: [],
        due_date: "2020-07-06T19:00:00.000Z",
        __v: 0,
      },
      {
        _id: 7,
        name: "Task 4",
        description: "hg hgh hg hg",
        pre_req: 0,
        task_list: 1,
        status: "in-progress",
        attachments: [],
        comments: [],
        members: [1, 2],
        sub_tasks: [],
        due_date: "2020-07-06T19:00:00.000Z",
        __v: 0,
      },
      {
        _id: 8,
        name: "Task 4",
        description: "hg hgh hg hg",
        pre_req: 0,
        task_list: 1,
        status: "in-progress",
        attachments: [],
        comments: [],
        members: [1, 2],
        sub_tasks: [],
        due_date: "2020-07-06T19:00:00.000Z",
        __v: 0,
      },
      {
        _id: 9,
        name: "Task 4",
        description: "hg hgh hg hg",
        pre_req: 0,
        task_list: 1,
        status: "in-progress",
        attachments: [],
        comments: [],
        members: [1, 2],
        sub_tasks: [],
        due_date: "2020-07-06T19:00:00.000Z",
        __v: 0,
      },
      {
        _id: 10,
        name: "Task 4",
        description: "hg hgh hg hg",
        pre_req: 0,
        task_list: 1,
        status: "in-progress",
        attachments: [],
        comments: [],
        members: [1, 2],
        sub_tasks: [],
        due_date: "2020-07-06T19:00:00.000Z",
        __v: 0,
      },
      {
        _id: 11,
        name: "Tean A",
        description: "GFG YG ghas hgas hgja sdaugd djhgjsd sjhs saJHAS lsa",
        pre_req: 0,
        task_list: 1,
        status: "in-progress",
        attachments: [],
        comments: [],
        members: [1, 2, 3, 4],
        sub_tasks: [],
        due_date: "2020-07-06T19:00:00.000Z",
        __v: 0,
      },
    ],
    _id: 1,
    name: "Task List",
    __v: 0,
  },
  {
    project: 1,
    tasks: [],
    _id: 2,
    name: "Task List",
    __v: 0,
  },
  {
    project: 1,
    tasks: [],
    _id: 3,
    name: "Task List",
    __v: 0,
  },
  {
    project: 1,
    tasks: [],
    _id: 4,
    name: "Task List",
    __v: 0,
  },
  {
    project: 1,
    tasks: [],
    _id: 5,
    name: "Task List",
    __v: 0,
  },
];
// let lanes = [];
// for (let i = 0; i < result.length; i++) {
//   let taskList = result[i];
//   let tasks = taskList.tasks;
//   taskList.tasks = [];
//   lanes.push(taskList);
//   for (let j = 0; j < tasks.length; j++) {
//     let task = tasks[j];
//     if (task.members.includes(1)) {
//       task.draggable = true;
//     } else {
//       task.draggable = false;
//     }
//     // task.metadata = { attachments:task.attachments,comments:task.comments,members:task.members };
//     task.metadata = { ...task };
//     lanes[i].tasks.push(task);
//   }
//   lanes[i].cards = lanes[i].tasks;
//   delete lanes[i].tasks;
// }

// console.log(lanes[0].cards[0]);

// const filteredData = (result, user_id) => {
//   let lanes = [];
//   for (let i = 0; i < result.length; i++) {
//     let taskList = result[i];
//     let tasks = taskList.tasks;
//     taskList.tasks = [];
//     lanes.push(taskList);
//     for (let j = 0; j < tasks.length; j++) {
//       let task = tasks[j];
//       if (task.members.includes(user_id)) {
//         task.draggable = true;
//       } else {
//         task.draggable = false;
//       }

//       lanes[i].tasks.push(task);
//     }
//   }
//   return lanes;
// };

// const list = result.map((project) => {
//   const { tasks } = project;
//   return {
//     ...project,
//     tasks: tasks.map((task) => {
//       return {
//         ...task,
//         draggable: task.members.includes(1),
//       };
//     }),
//   };
// });

// console.log("====================================");
// console.log(list);
// console.log("====================================");

// module.exports = {
//   filteredData,
// };
