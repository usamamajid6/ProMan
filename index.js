const express = require("express");
const app = express();
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


app.listen(PORT, e => {
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