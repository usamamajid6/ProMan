const Comment = require("../Schemas/CommentSchema");
const TaskAPI = require("./TaskAPI");
const UserAPI = require("./UserAPI");
const TimelineAPI = require("./TimelineAPI");
const getLastId = async () => {
  try {
    const result = await Comment.find().sort({ _id: -1 }).limit(1);
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

const createNewComment = async (message, member_id, task_id, project_id) => {
  try {
    let _id = await getLastId();
    _id = parseInt(_id);
    ++_id;
    // let _id=1;
    const comment = new Comment({
      _id,
      message,
      member: parseInt(member_id),
    });
    try {
      const result = await Comment.create(comment);
      const member = await UserAPI.getUser(member_id);
      const task = await TaskAPI.getTaskById(task_id);
      let content = member.name + " commented on task " + task.name;
      await TimelineAPI.createNewTimeline(content, "blue", project_id);
      return result;
    } catch (e) {
      console.log("Problem in Adding New Comment.", e);
      return e;
    }
  } catch (e) {
    console.log("Problem in Getting Last Id for New Comment.", e);
    return e;
  }
};

const getCommentById = async (_id) => {
  try {
    const comment = Comment.findOne({ _id: parseInt(_id) }).populate("member");
    return comment;
  } catch (e) {
    console.log("Problem in getCommentById.", e);
    return e;
  }
};

module.exports = { createNewComment, getCommentById };
