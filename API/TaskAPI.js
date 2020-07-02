const Task = require("../Schemas/TaskSchema");

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
  task_list_id
) => {
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
      members: member_id_array,
      task_list: task_list_id,
    });
    try {
      const result = await Task.create(task);
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
      .populate("members")
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

const updateTaskStatus = async (_id, status) => {
  try {
    const result = await Task.updateOne({ _id: parseInt(_id) }, { status });
    return result;
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
  addAttachment,
  addComment,
  addSubTask,
  addMember,
};
