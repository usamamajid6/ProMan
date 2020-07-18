const Chat = require("../Schemas/ChatSchema");
const getLastId = async () => {
  try {
    const result = await Chat.find().sort({ _id: -1 }).limit(1);
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

const createNewChat = async (message, member_id, project_id) => {
  try {
    let _id = await getLastId();
    _id = parseInt(_id);
    ++_id;
    const chat = new Chat({
      _id,
      message,
      member: parseInt(member_id),
      project: parseInt(project_id),
    });
    try {
      const result = await Chat.create(chat);
      const updatedResult = await Chat.findOne({ _id }).populate("member");
      return updatedResult;
    } catch (e) {
      console.log("Problem in Adding New Chat.", e);
      return e;
    }
  } catch (e) {
    console.log("Problem in Getting Last Id for New Chat.", e);
    return e;
  }
};

const getChatByProjectId = async (project_id) => {
  try {
    const chat = Chat.find({ project: parseInt(project_id) }).populate(
      "member"
    );
    return chat;
  } catch (e) {
    console.log("Problem in getChatByProjectId.", e);
    return e;
  }
};

module.exports = { createNewChat, getChatByProjectId };
