const SubTask = require("../Schemas/SubTaskSchema");
const TaskAPI = require("./TaskAPI");
const UserAPI = require("./UserAPI");
const TimelineAPI = require("./TimelineAPI");
const getLastId = async () => {
  try {
    const result = await SubTask.find().sort({ _id: -1 }).limit(1);
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

const createNewSubTask = async (
  name,
  description,
  member_id,
  task_id,
  project_id
) => {
  try {
    let _id = await getLastId();
    _id = parseInt(_id);
    ++_id;
    // let _id=1;
    const subTask = new SubTask({
      _id,
      name,
      description,
      member: parseInt(member_id),
    });
    try {
      const result = await SubTask.create(subTask);
      const member = await UserAPI.getUser(member_id);
      const task = await TaskAPI.getTaskById(task_id);
      let content =
        member.name + " added" + result.name + " sub-task in task " + task.name;
      await TimelineAPI.createNewTimeline(content, "blue", project_id);
      return result;
    } catch (e) {
      console.log("Problem in Adding New SubTask.", e);
      return e;
    }
  } catch (e) {
    console.log("Problem in Getting Last Id for New SubTask.", e);
    return e;
  }
};

const getSubTaskById = async (_id) => {
  try {
    const subTask = SubTask.findOne({ _id: parseInt(_id) }).populate("member");
    return subTask;
  } catch (e) {
    console.log("Problem in getSubTaskById.", e);
    return e;
  }
};

const updateSubTaskStatus = async (_id, status) => {
  try {
    const result = await SubTask.updateOne({ _id: parseInt(_id) }, { status });
    return result;
  } catch (e) {
    console.log("Problem in Updating SubTask Status", e);
    return e;
  }
};

module.exports = {
  createNewSubTask,
  getSubTaskById,
  updateSubTaskStatus,
};
