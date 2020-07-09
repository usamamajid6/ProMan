const Task = require("../Schemas/TaskSchema");
const TaskList = require("../Schemas/TaskListSchema");
const TaskListAPI = require("./TaskListAPI");
const User = require("../API/UserAPI");
const Project = require("../API/ProjectAPI");
const getLastId = async () => {
  try {
    const result = await Task.find().sort({ _id: -1 }).limit(1);
    if (result.length === 0) {
      return 0;
    } else {
      return result[0]._id;
    }
  } catch (e) {
    console.log("Error while getting last Last ID.", e);
    return e;
  }
};

const createNewTask = async (
  name,
  description,
  pre_req_id,
  due_date,
  member_id_array,
  task_list_id,
  project_id
) => {
  let member_array = [];
  for (let i = 0; i < member_id_array.length; i++) {
    const element = member_id_array[i];
    let data = {
      _id: element,
      member: element,
      task_status: "in-progress",
      last_updated_on: Date.now(),
    };
    member_array.push(data);
  }

  try {
    let _id = await getLastId();
    _id = parseInt(_id);
    ++_id;
    // let _id=1;
    const task = new Task({
      _id,
      name,
      description,
      pre_req: pre_req_id,
      due_date,
      members: member_array,
      task_list: task_list_id,
    });
    try {
      const result = await Task.create(task);
      const taskList = await TaskList.find({ project: project_id });
      let inProgressTaskListId = taskList[0]._id;
      await TaskListAPI.addTask(inProgressTaskListId, result._id);
      return result;
    } catch (e) {
      console.log("Problem in Adding New Task.", e);
      return e;
    }
  } catch (e) {
    console.log("Problem in Getting Last Id for New Task.", e);
    return e;
  }
};

const getTaskById = async (_id) => {
  try {
    const task = Task.findOne({ _id: parseInt(_id) })
      // .populate("members")
      .populate("comments")
      .populate("attachments")
      .populate("sub_tasks")
      .populate("pre_req");
    return task;
  } catch (e) {
    console.log("Problem in getTaskById.", e);
    return e;
  }
};

const updateTaskStatus = async (_id, status, member_id, project_id) => {
  try {
    const result = await Task.findOne({ _id }); // Get Task Data
    let in_progress = true;
    let pending = true;
    let done = true;
    let data = result.toObject(); // Save Task Data To other variable
    // Loop for checking  status of all members to set main status of task
    for (let i = 0; i < data.members.length; i++) {
      const element = data.members[i];
      if (member_id === element._id) {
        element.task_status = status;
        element.last_updated_on = Date.now();
      }
      if (element.task_status !== "in_progress") {
        in_progress = false;
      }
      if (element.task_status !== "pending") {
        pending = false;
      }
      if (element.task_status !== "done") {
        done = false;
      }
    }
    let new_status = "in-progress"; // Variable for new status
    if (pending) {
      new_status = "pending";
    }
    if (done) {
      new_status = "done";
    }
    //Setting new status for task and as well as for its members
    const updatedResult = await Task.updateOne(
      { _id },
      { members: data.members, status: new_status }
    );

    const taskList = await TaskList.find({ project: project_id });
    let inProgressListId = taskList[0]._id;
    let pendingListId = taskList[1]._id;
    let doneListId = taskList[2]._id;
    if (new_status === "in-progress") {
      await TaskListAPI.addTask(inProgressListId, _id);
      await TaskListAPI.removeTask(pendingListId, _id);
      await TaskListAPI.removeTask(doneListId, _id);
    }
    if (pending) {
      await TaskListAPI.removeTask(inProgressListId, _id);
      await TaskListAPI.addTask(pendingListId, _id);
      await TaskListAPI.removeTask(doneListId, _id);
    }
    if (done) {
      await TaskListAPI.removeTask(inProgressListId, _id);
      await TaskListAPI.removeTask(pendingListId, _id);
      await TaskListAPI.addTask(doneListId, _id);
    }
    return updatedResult;
  } catch (e) {
    console.log("Problem in Updating Task Status", e);
    return e;
  }
};

const updateTTAES = async (element) => {
  try {
    let startDate = new Date("Jan 01 2007 11:00:00");
    let endDate = new Date("Jan 01 2007 11:30:00");
    let starthour = parseInt(startDate.getHours());
    let endhour = parseInt(endDate.getHours());

    if (starthour > endhour) {
      console.log("Hours diff:" + parseInt(starthour - endhour));
    } else {
      console.log("Hours diff:" + parseInt(endhour - starthour));
    }
  } catch (e) {
    console.log("Problem in updateTTAES in TaskAPI", e);
  }
};

const updateTaskStatusLeader = async (_id, status, project_id) => {
  try {
    const result = await Task.findOne({ _id }); // Get Task Data
    let data = result.toObject(); // Save Task Data To other variable
    // Loop for checking  status of all members to set main status of task
    for (let i = 0; i < data.members.length; i++) {
      const element = data.members[i];
      element.task_status = status;
    }
    //Setting new status for task and as well as for its members
    const updatedResult = await Task.updateOne(
      { _id },
      { members: data.members, status }
    );

    const taskList = await TaskList.find({ project: project_id });
    let inProgressListId = taskList[0]._id;
    let pendingListId = taskList[1]._id;
    let doneListId = taskList[2]._id;
    let currentTaskListId = data.task_list;
    if (status === "in-progress") {
      await TaskListAPI.addTask(inProgressListId, _id);
      await TaskListAPI.removeTask(pendingListId, _id);
      await TaskListAPI.removeTask(doneListId, _id);
      await TaskListAPI.addTask(currentTaskListId, _id);
    }
    if (status === "done") {
      await TaskListAPI.removeTask(inProgressListId, _id);
      await TaskListAPI.removeTask(pendingListId, _id);
      await TaskListAPI.addTask(doneListId, _id);
      await TaskListAPI.removeTask(currentTaskListId, _id);
      for (let i = 0; i < data.members.length; i++) {
        const element = data.members[i];
        updateTTAES();
      }
    }
    return updatedResult;
  } catch (e) {
    console.log("Problem in Updating Task Status", e);
    return e;
  }
};

const addAttachment = async (_id, attachment_id) => {
  try {
    const result = await Task.updateOne(
      { _id },
      { $push: { attachments: attachment_id } }
    );
    return result;
  } catch (e) {
    console.log("Problem in addAttachment", e);
    return e;
  }
};

const addComment = async (_id, comment_id) => {
  try {
    const result = await Task.updateOne(
      { _id },
      { $push: { comments: comment_id } }
    );
    return result;
  } catch (e) {
    console.log("Problem in addComment", e);
    return e;
  }
};

const addSubTask = async (_id, subtask_id) => {
  try {
    const result = await Task.updateOne(
      { _id },
      { $push: { sub_tasks: subtask_id } }
    );
    return result;
  } catch (e) {
    console.log("Problem in addSubTask", e);
    return e;
  }
};

const addMember = async (_id, member_id) => {
  try {
    const result = await Task.updateOne(
      { _id },
      { $push: { members: member_id } }
    );
    return result;
  } catch (e) {
    console.log("Problem in addMember", e);
    return e;
  }
};
// const addMember=async (_id,project_id)=>{
//     try {
//         const result = await User.updateOne({_id},{$push:{projects:project_id}});
//         return result;
//     } catch (e) {
//         console.log("Problem in getAllUsers",e);
//         return e;
//     }
// }

// const removeMember=async (_id,project_id)=>{
//     try {
//         const result = await User.updateOne({_id},{$push:{projects:project_id}});
//         return result;
//     } catch (e) {
//         console.log("Problem in getAllUsers",e);
//         return e;
//     }
// }

module.exports = {
  createNewTask,
  getTaskById,
  updateTaskStatus,
  updateTaskStatusLeader,
  addAttachment,
  addComment,
  addSubTask,
  addMember,
};
