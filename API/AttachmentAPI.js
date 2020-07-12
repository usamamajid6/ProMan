const Attachment = require("../Schemas/AttachmentSchema");
const TaskAPI = require("./TaskAPI");
const TimelineAPI = require("../API/TimelineAPI");
const UserAPI = require("./UserAPI");
const getLastId = async () => {
  try {
    const result = await Attachment.find().sort({ _id: -1 }).limit(1);
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

const createNewAttachment = async (
  name,
  path,
  member_id,
  project_id,
  task_id
) => {
  try {
    let _id = await getLastId();
    _id = parseInt(_id);
    ++_id;
    // let _id=1;
    const attachment = new Attachment({
      _id,
      name,
      path,
      member: parseInt(member_id),
    });
    try {
      const result = await Attachment.create(attachment);
      const member = await UserAPI.getUser(member_id);
      const task = await TaskAPI.getTaskById(task_id);
      let content =
        "New attachement " +
        name +
        " added to task " +
        task.name +
        " by " +
        member.name;
      await TimelineAPI.createNewTimeline(content, "blue", project_id);
      return result;
    } catch (e) {
      console.log("Problem in Adding New Attachment.", e);
      return e;
    }
  } catch (e) {
    console.log("Problem in Getting Last Id for New Attachment.", e);
    return e;
  }
};

const getAttachmentById = async (_id) => {
  try {
    const attachment = Attachment.findOne({ _id: parseInt(_id) }).populate(
      "member"
    );
    return attachment;
  } catch (e) {
    console.log("Problem in getAttachmentById.", e);
    return e;
  }
};

module.exports = { createNewAttachment, getAttachmentById };
