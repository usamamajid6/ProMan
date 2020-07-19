const TaskList = require("../Schemas/TaskListSchema");
const TimelineAPI = require("./TimelineAPI");
const getLastId = async () => {
  try {
    const result = await TaskList.find().sort({ _id: -1 }).limit(1);
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

const createNewTaskList = async (name, project_id, description) => {
  try {
    let _id = await getLastId();
    _id = parseInt(_id);
    ++_id;
    const taskList = new TaskList({
      _id,
      name,
      project: parseInt(project_id),
      description,
    });
    try {
      const result = await TaskList.create(taskList);
      let content = "New Task List " + name + " added to this project";
      await TimelineAPI.createNewTimeline(content, "blue", project_id);
      return result;
    } catch (e) {
      console.log("Problem in Adding New TaskList.", e);
      return e;
    }
  } catch (e) {
    console.log("Problem in Getting Last Id for New TaskList.", e);
    return e;
  }
};

const getTaskListById = async (_id) => {
  try {
    const taskList = TaskList.findOne({ _id: parseInt(_id) })
      .populate("project")
      .populate("tasks");
    return taskList;
  } catch (e) {
    console.log("Problem in getTaskListById.", e);
    return e;
  }
};
const ifPresent = (array, _id) => {
  let found = false;
  for (let i = 0; i < array.length; i++) {
    if (array[i] === _id) {
      found = true;
      break;
    }
  }
  return found;
};

const addTask = async (_id, task_id) => {
  try {
    const res = await TaskList.findById(_id);
    let tasks = res.tasks;
    if (!ifPresent(tasks, task_id)) {
      tasks.push(task_id);
    }
    const result = await TaskList.updateOne({ _id }, { tasks });
    return result;
  } catch (e) {
    console.log("Problem in addTask", e);
    return e;
  }
};

const removeTask = async (_id, task_id) => {
  try {
    const res = await TaskList.findById(_id);

    let tasks = res.tasks;
    const index = tasks.indexOf(task_id);
    if (index > -1) {
      tasks.splice(index, 1);
    }
    const result = await TaskList.updateOne({ _id }, { tasks });
    return result;
  } catch (e) {
    console.log("Problem in removeTask", e);
    return e;
  }
};

const dataAmmendment = (result, user_id) => {
  let lanes = result.map((task_list) => {
    let { tasks } = task_list;
    return {
      name: task_list.name,
      title: task_list.name,
      id: task_list._id,
      _id: task_list._id,
      project: task_list.project,
      draggable: false,
      cards: tasks.map((task) => {
        return {
          draggable: false,
          id: task._id,
          title: task.name,
          metedata: task,
          description: task.description,
        };
      }),
    };
  });
  return lanes;
};

const getDueOn = (due_date) => {
  let date = new Date(due_date);
  let todayDate = new Date();
  let month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  if (
    date.getFullYear() === todayDate.getFullYear() &&
    date.getMonth() === todayDate.getMonth() &&
    date.getDate() === todayDate.getDate()
  ) {
    return `Due on : ${date.getHours()}:${date.getMinutes()}`;
  }
  const date_tomorrow = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    todayDate.getDate() + 1
  );
  if (
    date_tomorrow.getFullYear() == date.getFullYear() &&
    date_tomorrow.getMonth() == date.getMonth() &&
    date_tomorrow.getDate() == date.getDate()
  ) {
    return `Tomorrow at ${date.getHours()}:${date.getMinutes()}`;
  }

  return `Due on : ${
    month[date.getMonth()]
  },${date.getDate()} ${date.getFullYear()}`;
};

const dataAmmendment1 = (result, user_id) => {
  let task_list = result.map((task_list) => {
    let { tasks } = task_list;
    return {
      ...task_list,
      tasks: tasks.map((task) => {
        return {
          ...task,
          due_on: getDueOn(task.due_date),
        };
      }),
    };
  });
  return task_list;
};

const getTaskListsByProjectId = async (project_id, user_id) => {
  try {
    let result = await TaskList.find({ project: project_id }).populate({
      path: "tasks",
      populate: [
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
        {
          path: "subscriber",
        },
      ],
    });
    // .populate("tasks.task.members")
    // .populate("tasks.task.comments");
    // const data = JSON.parse(JSON.stringify(result));
    // const lanes = dataAmmendment1(data, user_id);
    return result;
  } catch (e) {
    console.log("Problem in getTaskListsByProjectId", e);
    return e;
  }
};

module.exports = {
  createNewTaskList,
  getTaskListById,
  addTask,
  getTaskListsByProjectId,
  removeTask,
};
