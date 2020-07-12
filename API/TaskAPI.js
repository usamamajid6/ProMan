const Task = require("../Schemas/TaskSchema");
const TaskList = require("../Schemas/TaskListSchema");
const TaskListAPI = require("./TaskListAPI");
const UserAPI = require("../API/UserAPI");
const Project = require("../API/ProjectAPI");
const Emailer = require("../Email");
const TimelineAPI = require("./TimelineAPI");
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
      last_updated_on: new Date(),
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
      project: project_id,
    });
    try {
      const result = await Task.create(task);
      const taskList = await TaskList.find({ project: project_id });
      let inProgressTaskListId = taskList[0]._id;
      // Add to In-Progress List
      await TaskListAPI.addTask(inProgressTaskListId, result._id);
      // Add to Orignal List
      await TaskListAPI.addTask(task_list_id, result._id);
      // Get Task Data
      const data = await Task.findOne({ _id: result._id }).populate(
        "members.member"
      );
      let members_email_array = [];
      for (let i = 0; i < data.members.length; i++) {
        const element = data.members[i];
        members_email_array.push(element.member.email);
      }
      let subject = "New Task Has Been Assigned!";
      let message =
        "AoA, A new task has been assigned to you, task name is: " +
        data.name +
        ", further details are: " +
        data.description +
        ". This task's due date is: " +
        data.due_date +
        ".";
      Emailer.sendMail(members_email_array, subject, message);

      // Add Timeline
      const taskListData = await TaskListAPI.getTaskListById(task_list_id);
      let content =
        "New Task " +
        data.name +
        " has been added to task list " +
        taskListData.name;
      await TimelineAPI.createNewTimeline(content, "blue", project_id);
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
    const task = Task.findOne({ _id: parseInt(_id) }).populate([
      {
        path: "members.member",
        select: { name: 1 },
      },
      {
        path: "comments",
        populate: {
          path: "member",
          select: { name: 1 },
        },
      },
      {
        path: "pre_req",
        select: { name: 1 },
      },
      ,
      {
        path: "task_list",
        select: { name: 1 },
      },
      {
        path: "attachments",
      },
      {
        path: "sub_tasks",
      },
    ]);
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

const getMinutesBetweenDates = (sDate, eDate) => {
  var startDate = new Date(sDate);
  var endDate = new Date(eDate);
  var diffMs;
  if (startDate > endDate) {
    diffMs = startDate - endDate;
  } else {
    diffMs = endDate - startDate;
  }
  var diffDays = Math.floor(diffMs / 86400000); // days
  var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
  let totalMins =
    Math.abs(diffDays) * 24 * 60 + Math.abs(diffHrs) * 60 + Math.abs(diffMins);
  return totalMins;
};

const updateTTAES = async (
  member_data,
  project_id,
  task_due_date,
  task_start_date
) => {
  try {
    let totalMinutesAssignForTask = getMinutesBetweenDates(
      task_start_date,
      task_due_date
    );
    let totalMinutesTakenByMember = getMinutesBetweenDates(
      task_start_date,
      member_data.last_updated_on
    );
    if (totalMinutesTakenByMember === 0) {
      totalMinutesTakenByMember = 1;
    }
    let efficiency_score =
      (totalMinutesAssignForTask / totalMinutesTakenByMember) * 100;

    if (efficiency_score > 100) {
      efficiency_score = 100;
    }
    if (efficiency_score < 30) {
      efficiency_score = 30;
    }
    await UserAPI.updateTTAES(member_data._id, efficiency_score);
    await Project.updateTTAES(project_id, member_data._id, efficiency_score);
  } catch (e) {
    console.log("Problem in updateTTAES in TaskAPI", e);
  }
};

const updateTaskStatusLeader = async (_id, status, project_id) => {
  try {
    let members_email_array = [];
    const result = await Task.findOne({ _id }).populate("members.member"); // Get Task Data
    let data = result.toObject(); // Save Task Data To other variable
    // Loop for checking  status of all members to set main status of task
    for (let i = 0; i < data.members.length; i++) {
      const element = data.members[i];
      element.task_status = status;
      members_email_array.push(element.member.email);
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
        updateTTAES(element, project_id, data.due_date, data.createdAt);
      }
    }
    let subject = "Task Status Changed!";
    let message =
      "AoA, Your Task: " +
      data.name +
      "'s status has been changed to: " +
      status.toUpperCase() +
      ".";
    Emailer.sendMail(members_email_array, subject, message);

    // Add Timeline

    const taskListData = await TaskListAPI.getTaskListById(currentTaskListId);
    let content =
      "Task " +
      data.name +
      " status has been changed in task list" +
      taskListData.name;
    if (status === "in-progress") {
      await TimelineAPI.createNewTimeline(content, "red", project_id);
    }
    if (status === "done") {
      await TimelineAPI.createNewTimeline(content, "green", project_id);
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

const getTasksBeforeDueDate = async (howMuchMinutesBefore) => {
  let now = new Date();
  let dateForCondition = new Date();
  dateForCondition.setMinutes(dateForCondition.getMinutes() + 12);

  console.log("====================================");
  console.log(now);
  console.log(dateForCondition);
  console.log("====================================");
  try {
    const result = await Task.find({
      due_date: { $gte: now, $lte: dateForCondition },
    });
    return result;
  } catch (e) {
    return e;
  }
};

const getOverDueTasks = async (project_id) => {
  try {
    const result = await Task.find({
      project: project_id,
      status: "in-progress",
      due_date: { $lte: new Date() },
    });
    return result;
  } catch (e) {
    console.log("Problem in getOverDueTasks method", e);
    return e;
  }
};

const getUpcomingDeadlines = async (project_id) => {
  try {
    let now = new Date();
    let dateForInHour = new Date();
    dateForInHour.setMinutes(dateForInHour.getMinutes() + 60);
    let dateForInSixHour = new Date();
    dateForInSixHour.setMinutes(dateForInSixHour.getMinutes() + 6 * 60);
    let dateForInTwelveHour = new Date();
    dateForInTwelveHour.setMinutes(dateForInTwelveHour.getMinutes() + 12 * 60);
    let dateForinDay = new Date();
    dateForinDay.setMinutes(dateForinDay.getMinutes() + 24 * 60);
    const inHour = await Task.find({
      project: project_id,
      status: "in-progress",
      due_date: { $gte: now, $lte: dateForInHour },
    });
    const inSixHour = await Task.find({
      project: project_id,
      status: "in-progress",
      due_date: { $gte: now, $lte: dateForInSixHour },
    });
    const inTweleveHour = await Task.find({
      project: project_id,
      status: "in-progress",
      due_date: { $gte: now, $lte: dateForInTwelveHour },
    });
    const inDay = await Task.find({
      project: project_id,
      status: "in-progress",
      due_date: { $gte: now, $lte: dateForinDay },
    });
    const result = { inHour, inSixHour, inTweleveHour, inDay };
    return result;
  } catch (e) {
    console.log("Problem in getOverDueTasks method", e);
    return e;
  }
};

module.exports = {
  createNewTask,
  getTaskById,
  updateTaskStatus,
  updateTaskStatusLeader,
  addAttachment,
  addComment,
  addSubTask,
  addMember,
  getTasksBeforeDueDate,
  getOverDueTasks,
  getUpcomingDeadlines,
};
