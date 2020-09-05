const Task = require("../Schemas/TaskSchema");
const TaskList = require("../Schemas/TaskListSchema");
const TaskListAPI = require("./TaskListAPI");
const UserAPI = require("../API/UserAPI");
const Project = require("../API/ProjectAPI");
const Emailer = require("../Email");
const TimelineAPI = require("./TimelineAPI");
const NotificationAPI = require("./NotificationAPI");

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
        await NotificationAPI.createNewNotification(
          "Task Assigned!",
          `You have been assigned to new Task: ${data.name}`,
          element.member._id
        );
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
          select: { name: 1, dp: 1 },
        },
      },
      {
        path: "pre_req",
        select: { name: 1, status: 1 },
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
      {
        path: "subscriber",
      },
    ]);
    return task;
  } catch (e) {
    console.log("Problem in getTaskById.", e);
    return e;
  }
};

const getTasksByUserId = async (user_id, project_id) => {
  try {
    const task = Task.find({
      members: { $elemMatch: { _id: user_id } },
      status: { $in: ["in-progress", "pending"] },
      project: project_id,
    }).populate([
      {
        path: "members.member",
        select: { name: 1 },
      },
      {
        path: "comments",
        populate: {
          path: "member",
          select: { name: 1, dp: 1 },
        },
      },
      {
        path: "pre_req",
        select: { name: 1, status: 1 },
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
      {
        path: "subscriber",
      },
    ]);
    return task;
  } catch (e) {
    console.log("Problem in getTasksById.", e);
    return e;
  }
};

const updateTaskStatus = async (_id, status, member_id, project_id) => {
  try {
    const result = await Task.findOne({ _id }).populate("subscriber"); // Get Task Data
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

    // Send Email To Subscribers

    let subscriber_email_array = [];
    for (let i = 0; i < data.subscriber.length; i++) {
      const element = data.subscriber[i];
      subscriber_email_array.push(element.email);
      await NotificationAPI.createNewNotification(
        "Task Status Changed on Subscribed Task!",
        `Your's subscribed Task: ${
          data.name
        } status changed to ${new_status.toUpperCase()}.`,
        element._id
      );
    }

    let subject = "Task Status Changed on Subscribed Task!";
    let message =
      "AoA, Yours subscribed Task: " +
      data.name +
      "'s status has been changed to: " +
      new_status.toUpperCase() +
      ".";
    if (subscriber_email_array.length !== 0) {
      Emailer.sendMail(subscriber_email_array, subject, message);
    }
    return updatedResult;
  } catch (e) {
    console.log("Problem in Updating Task Status", e);
    return e;
  }
};

const getMinutesBetweenDates = (sDate, eDate) => {
  let ifEndDateIsGreater = false;
  let startDate = new Date(sDate);
  let endDate = new Date(eDate);
  let diffMs;
  if (startDate > endDate) {
    diffMs = startDate - endDate;
  } else {
    diffMs = endDate - startDate;
    ifEndDateIsGreater = true;
  }
  let diffDays = Math.floor(diffMs / 86400000); // days
  let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
  let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
  let totalMins =
    Math.abs(diffDays) * 24 * 60 + Math.abs(diffHrs) * 60 + Math.abs(diffMins);
  if (ifEndDateIsGreater) {
    totalMins *= -1;
  }
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
    if (totalMinutesTakenByMember < 0) {
      totalMinutesTakenByMember = Math.abs(totalMinutesTakenByMember);
      totalMinutesTakenByMember =
        totalMinutesTakenByMember + totalMinutesAssignForTask;
    }
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
    let subscriber_email_array = [];
    const result = await Task.findOne({ _id })
      .populate("members.member")
      .populate("subscriber"); // Get Task Data
    let data = result.toObject(); // Save Task Data To other variable
    // Loop for checking  status of all members to set main status of task
    for (let i = 0; i < data.members.length; i++) {
      const element = data.members[i];
      element.task_status = status;
      members_email_array.push(element.member.email);
      await NotificationAPI.createNewNotification(
        "Task Status Changed!",
        `The Task: ${
          data.name
        } status have been changed to ${status.toUpperCase()}.`,
        element.member._id
      );
    }
    for (let i = 0; i < data.subscriber.length; i++) {
      const element = data.subscriber[i];
      subscriber_email_array.push(element.email);
      await NotificationAPI.createNewNotification(
        "Task Status Changed On Subscribed Task!",
        `Your's subscribed Task: ${
          data.name
        } status have been changed to ${status.toUpperCase()}`,
        element._id
      );
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
    // Send Email To Members
    let subject = "Task Status Changed!";
    let message =
      "AoA, Your Task: " +
      data.name +
      "'s status has been changed to: " +
      status.toUpperCase() +
      ".";
    Emailer.sendMail(members_email_array, subject, message);

    // Send Email To Subscribers
    subject = "Task Status Changed on Subscribed Task!";
    message =
      "AoA, Yours subscribed Task: " +
      data.name +
      "'s status has been changed to: " +
      status.toUpperCase() +
      ".";
    if (subscriber_email_array.length !== 0) {
      Emailer.sendMail(subscriber_email_array, subject, message);
    }
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

const addMember = async (_id, member_id, project_id) => {
  try {
    let data = await Task.findOne({ _id });
    let member_array = data.members;
    let member = {
      _id: member_id,
      member: member_id,
      task_status: "in-progress",
      last_updated_on: new Date(),
    };
    member_array.push(member);
    result = await Task.updateOne({ _id }, { members: member_array });
    await removeSubscriber(_id, member_id, project_id);
    data = await Task.findOne({ _id })
      .populate("members.member")
      .populate("subscriber");
    await NotificationAPI.createNewNotification(
      "Added to Existing Task!",
      `You have been added to task: : ${data.name}`,
      member_id
    );
    let new_member_data = await UserAPI.getUser(member_id);
    let members_email_array = [];
    for (let i = 0; i < data.members.length - 1; i++) {
      const element = data.members[i];
      members_email_array.push(element.member.email);
      await NotificationAPI.createNewNotification(
        "New Member Existing Added!",
        `A new Member ${new_member_data.name} added to exiting task: : ${data.name}`,
        element.member._id
      );
    }

    let subject = "New Member Added To Existing Task!";
    let message =
      `A new Member ${new_member_data.name} added to task: : ${data.name}` +
      ", further details are: " +
      data.description +
      ". This task's due date is: " +
      data.due_date +
      ".";
    Emailer.sendMail(members_email_array, subject, message);

    subject = "Added To Existing Task!";
    message =
      "AoA, An existing task has been assigned to you, task name is: " +
      data.name +
      ", further details are: " +
      data.description +
      ". This task's due date is: " +
      data.due_date +
      ".";
    Emailer.sendMail([new_member_data.email], subject, message);

    // Add Timeline
    let content =
      "In Task " +
      data.name +
      " a new member added, member name is: " +
      new_member_data.name;
    await TimelineAPI.createNewTimeline(content, "blue", project_id);

    // Send To Subscribers

    let subscriber_email_array = [];
    for (let i = 0; i < data.subscriber.length; i++) {
      const element = data.subscriber[i];
      subscriber_email_array.push(element.email);
      await NotificationAPI.createNewNotification(
        "New Member Added on Subscribed Task!",
        `Your's subscribed Task: ${data.name} have a new member, member name is: ${new_member_data.name}`,
        element._id
      );
    }

    subject = "New Member Added on Subscribed Task!";
    message =
      "AoA, Yours subscribed Task: " +
      data.name +
      "'s have a new member: " +
      new_member_data.name +
      ".";
    if (subscriber_email_array.length !== 0) {
      Emailer.sendMail(subscriber_email_array, subject, message);
    }

    return result;
  } catch (e) {
    console.log("Problem in addMember", e);
    return e;
  }
};

const getOverDueTasks = async (project_id) => {
  try {
    const result = await Task.find({
      project: project_id,
      status: "in-progress",
      due_date: { $lte: new Date() },
    }).populate([
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
    }).populate([
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
    const inSixHour = await Task.find({
      project: project_id,
      status: "in-progress",
      due_date: { $gte: now, $lte: dateForInSixHour },
    }).populate([
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
    const inTweleveHour = await Task.find({
      project: project_id,
      status: "in-progress",
      due_date: { $gte: now, $lte: dateForInTwelveHour },
    }).populate([
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
    const inDay = await Task.find({
      project: project_id,
      status: "in-progress",
      due_date: { $gte: now, $lte: dateForinDay },
    }).populate([
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
    const result = { inHour, inSixHour, inTweleveHour, inDay };
    return result;
  } catch (e) {
    console.log("Problem in getOverDueTasks method", e);
    return e;
  }
};

const getAllTaskByProjectId = async (project_id) => {
  try {
    const result = await Task.find({
      project: project_id,
    }).populate([
      {
        path: "members.member",
        select: { name: 1 },
      },
      {
        path: "comments",
        populate: {
          path: "member",
          select: { name: 1, dp: 1 },
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
    return result;
  } catch (e) {
    console.log("Problem in getOverDueTasks method", e);
    return e;
  }
};

const getTaskByMember = async (project_id, member_id) => {
  try {
    const result = await Task.find({
      project: project_id,
      "members._id": member_id,
    }).populate([
      {
        path: "members.member",
        select: { name: 1 },
      },
      {
        path: "pre_req",
        select: { name: 1 },
      },
      {
        path: "sub_tasks",
      },
    ]);

    return result;
  } catch (e) {
    console.log("Problem in getTaskByMember method", e);
    return e;
  }
};

const getTasksByMembers = async (project_id, members) => {
  let data = [];
  for (let i = 0; i < members.length; i++) {
    const element = members[i];
    let tasksByMember = {};
    tasksByMember._id = element._id;
    tasksByMember.name = element.member.name;
    tasksByMember.email = element.member.email;
    tasksByMember.tasks = await getTaskByMember(project_id, element._id);
    data.push(tasksByMember);
  }
  try {
    return data;
  } catch (e) {
    console.log("Problem in getTasksByMembers method", e);
    return e;
  }
};

const notifyUsersWhoseTasksDueDateInOneHour = async () => {
  let now = new Date();
  let dateForCondition = new Date();
  dateForCondition.setMinutes(dateForCondition.getMinutes() + 60);
  try {
    const result = await Task.find({
      due_date: { $gte: now, $lte: dateForCondition },
      status: "in-progress",
      OneHourNotification: 0,
    }).populate([
      {
        path: "members.member",
        select: { name: 1, email: 1 },
      },
    ]);
    await Task.updateMany(
      {
        due_date: { $gte: now, $lte: dateForCondition },
        OneHourNotification: 0,
      },
      { OneHourNotification: 1 }
    );

    for (let i = 0; i < result.length; i++) {
      const task = result[i];
      for (let j = 0; j < task.members.length; j++) {
        const member = task.members[j];
        Emailer.sendMail(
          [member.member.email],
          "Task Due In One Hour!",
          `The Task: ${task.name} is due with in One Hour`
        );
        await NotificationAPI.createNewNotification(
          "Task Due In One Hour!",
          `The Task: ${task.name} is due with in One Hour`,
          member.member._id
        );
      }
    }
  } catch (e) {
    return e;
  }
};

const notifyUsersWhoseTasksDueDateInSixHour = async () => {
  let now = new Date();
  let dateForCondition = new Date();
  dateForCondition.setMinutes(dateForCondition.getMinutes() + 6 * 60);
  try {
    const result = await Task.find({
      due_date: { $gte: now, $lte: dateForCondition },
      status: "in-progress",
      SixHourNotification: 0,
    }).populate([
      {
        path: "members.member",
        select: { name: 1, email: 1 },
      },
    ]);
    await Task.updateMany(
      {
        due_date: { $gte: now, $lte: dateForCondition },
        SixHourNotification: 0,
      },
      { SixHourNotification: 1 }
    );

    for (let i = 0; i < result.length; i++) {
      const task = result[i];
      for (let j = 0; j < task.members.length; j++) {
        const member = task.members[j];
        Emailer.sendMail(
          [member.member.email],
          "Task Due In Six Hours!",
          `The Task: ${task.name} is due with in Six Hours`
        );
        await NotificationAPI.createNewNotification(
          "Task Due In Six Hours!",
          `The Task: ${task.name} is due with in Six Hours`,
          member.member._id
        );
      }
    }
  } catch (e) {
    return e;
  }
};

const notifyUsersWhoseTasksDueDateInTwelveHour = async () => {
  let now = new Date();
  let dateForCondition = new Date();
  dateForCondition.setMinutes(dateForCondition.getMinutes() + 12 * 60);
  try {
    const result = await Task.find({
      due_date: { $gte: now, $lte: dateForCondition },
      status: "in-progress",
      TwelveHourNotification: 0,
    }).populate([
      {
        path: "members.member",
        select: { name: 1, email: 1 },
      },
    ]);
    await Task.updateMany(
      {
        due_date: { $gte: now, $lte: dateForCondition },
        TwelveHourNotification: 0,
      },
      { TwelveHourNotification: 1 }
    );

    for (let i = 0; i < result.length; i++) {
      const task = result[i];
      for (let j = 0; j < task.members.length; j++) {
        const member = task.members[j];
        Emailer.sendMail(
          [member.member.email],
          "Task Due In Twelve Hours!",
          `The Task: ${task.name} is due with in Twelve Hours`
        );
        await NotificationAPI.createNewNotification(
          "Task Due In Tweleve Hours!",
          `The Task: ${task.name} is due with in Tweleve Hours`,
          member.member._id
        );
      }
    }
  } catch (e) {
    return e;
  }
};

const notifyUsersWhoseTasksDueDateInOneDay = async () => {
  let now = new Date();
  let dateForCondition = new Date();
  dateForCondition.setMinutes(dateForCondition.getMinutes() + 12 * 60);
  try {
    const result = await Task.find({
      due_date: { $gte: now, $lte: dateForCondition },
      status: "in-progress",
      OneDayNotification: 0,
    }).populate([
      {
        path: "members.member",
        select: { name: 1, email: 1 },
      },
    ]);
    await Task.updateMany(
      {
        due_date: { $gte: now, $lte: dateForCondition },
        OneDayNotification: 0,
      },
      { OneDayNotification: 1 }
    );

    for (let i = 0; i < result.length; i++) {
      const task = result[i];
      for (let j = 0; j < task.members.length; j++) {
        const member = task.members[j];
        Emailer.sendMail(
          [member.member.email],
          "Task Due In Twenty Four Hours!",
          `The Task: ${task.name} is due with in Twenty Four Hours`
        );
        await NotificationAPI.createNewNotification(
          "Task Due In Twenty Four Hours!",
          `The Task: ${task.name} is due with in Twenty Four Hours`,
          member.member._id
        );
      }
    }
  } catch (e) {
    return e;
  }
};

const ifPresent = (array, _id) => {
  let found = -1;
  for (let i = 0; i < array.length; i++) {
    if (array[i] === _id) {
      found = i;
      break;
    }
  }
  return found;
};

const addSubscriber = async (_id, member_id, project_id) => {
  try {
    const res = await Task.findById(_id);
    let subscriber = res.subscriber;
    let ifFound = ifPresent(subscriber, member_id);
    if (ifFound === -1) {
      const member = await UserAPI.getUser(member_id);
      let content = member.name + " subscribed to task: " + res.name;
      await TimelineAPI.createNewTimeline(content, "green", project_id);
      subscriber.push(member_id);
      Emailer.sendMail(
        [member.email],
        "You Subscribed!",
        `You have been subscribed to task: ${res.name}.`
      );
    }
    await NotificationAPI.createNewNotification(
      "You Subscribed!",
      `You have been subscribed to Task: ${res.name}`,
      member_id
    );
    const result = await Task.updateOne({ _id }, { subscriber });
    return result;
  } catch (e) {
    console.log("Problem in addMember", e);
    return e;
  }
};

const removeSubscriber = async (_id, member_id, project_id) => {
  try {
    const res = await Task.findById(_id);
    let subscriber = res.subscriber;
    let ifFound = ifPresent(subscriber, member_id);

    if (ifFound !== -1) {
      const member = await UserAPI.getUser(member_id);
      let content = member.name + " unsubscribed to task: " + res.name;
      await TimelineAPI.createNewTimeline(content, "blue", project_id);
      subscriber.splice(ifFound, 1);
      Emailer.sendMail(
        [member.email],
        "You Unsubscribed!",
        `You have been unsubscribed to task: ${res.name}.`
      );
      await NotificationAPI.createNewNotification(
        "You Unsubscribed!",
        `You have been unsubscribed to Task: ${res.name}`,
        member_id
      );
    }
    const result = await Task.updateOne({ _id }, { subscriber });
    return result;
  } catch (e) {
    console.log("Problem in addMember", e);
    return e;
  }
};

const getDependableTasks = async (task) => {
  try {
    let children = [];
    let data = task.toObject();
    data.children = [];
    const dependableTasks = await Task.find({ pre_req: data._id });
    if (dependableTasks.length === 0) {
      return data;
    } else {
      for (let i = 0; i < dependableTasks.length; i++) {
        const element = dependableTasks[i];
        let childData = await getDependableTasks(element);
        children.push(childData);
      }
      data.children = children;
      return data;
    }
  } catch (e) {
    console.log("Problem in getDependableTasks", e);
    return e;
  }
};

const getTasksInHierarchy = async (project_id) => {
  try {
    let data = [];
    const result = await Task.find({ project: project_id, pre_req: 0 });
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      let dependableTasks = await getDependableTasks(element);
      data.push(dependableTasks);
    }
    return data;
  } catch (e) {
    console.log("Problem in getTasksInHierarchy", e);
    return e;
  }
};

const updateTask = async (
  _id,
  name,
  description,
  due_date,
  what_changes,
  project_id
) => {
  try {
    let before_update_task = await Task.findOne({ _id });
    const result = await Task.updateOne(
      { _id },
      {
        name,
        description,
        due_date,
      }
    );

    let master_head = "";
    let master_content = "";

    if (what_changes === "name") {
      master_head = "Task Name Changed!";
      master_content = `Task's name chnaged to "${name}" from "${before_update_task.name}".`;
    }
    if (what_changes === "description") {
      master_head = "Task Description Changed!";
      master_content = `Task's Description chnaged to "${description}" from "${before_update_task.description}".`;
    }
    if (what_changes === "due_date") {
      master_head = "Task Due Date Changed!";
      master_content = `Task's name chnaged to "${due_date}" from "${before_update_task.due_date}".`;
    }
    data = await Task.findOne({ _id })
      .populate("members.member")
      .populate("subscriber");

    let members_email_array = [];
    for (let i = 0; i < data.members.length; i++) {
      const element = data.members[i];
      members_email_array.push(element.member.email);
      await NotificationAPI.createNewNotification(
        master_head,
        master_content,
        element.member._id
      );
    }

    let subject = master_head;
    let message = "AoA   " + master_content;
    Emailer.sendMail(members_email_array, subject, message);

    // Add Timeline
    let content = master_content;
    await TimelineAPI.createNewTimeline(content, "blue", project_id);

    // Send To Subscribers

    let subscriber_email_array = [];
    for (let i = 0; i < data.subscriber.length; i++) {
      const element = data.subscriber[i];
      subscriber_email_array.push(element.email);
      await NotificationAPI.createNewNotification(
        master_head + " on Subscribed Task!",
        master_content,
        element._id
      );
    }

    subject = master_head + " on Subscribed Task!";
    message = "AoA, Yours subscribed Task: " + master_content;
    if (subscriber_email_array.length !== 0) {
      Emailer.sendMail(subscriber_email_array, subject, message);
    }

    return result;
  } catch (e) {
    console.log("Problem In updateTask Method!", e);
    return e;
  }
};

// const sendNotification = (socket) => {
//   socket.emit("fromTaskAPI", { data: "Task" });
// };

module.exports = {
  createNewTask,
  getTaskById,
  getTasksByUserId,
  updateTaskStatus,
  updateTaskStatusLeader,
  addAttachment,
  addComment,
  addSubTask,
  addMember,
  notifyUsersWhoseTasksDueDateInOneHour,
  notifyUsersWhoseTasksDueDateInSixHour,
  notifyUsersWhoseTasksDueDateInTwelveHour,
  notifyUsersWhoseTasksDueDateInOneDay,
  getOverDueTasks,
  getUpcomingDeadlines,
  getAllTaskByProjectId,
  getTasksByMembers,
  addSubscriber,
  removeSubscriber,
  getTasksInHierarchy,
  updateTask,
};
