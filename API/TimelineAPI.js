const Timeline = require("../Schemas/TimelineSchema");
const ProjectAPI = require("./ProjectAPI");
const Project = require("../Schemas/ProjectSchema");
const getLastId = async () => {
  try {
    const result = await Timeline.find().sort({ _id: -1 }).limit(1);
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

const createNewTimeline = async (content, type, project_id) => {
  try {
    let _id = await getLastId();
    _id = parseInt(_id);
    ++_id;
    // let _id = 1;

    const timeline = new Timeline({
      _id,
      content,
      type,
    });
    try {
      const result = await Timeline.create(timeline);
      await Project.updateOne(
        { _id: project_id },
        { $push: { timelines: result._id } }
      );
      // await ProjectAPI.addTimeline(project_id, _id);
      return result;
    } catch (e) {
      console.log("Problem in Adding New Timeline.", e);
      return e;
    }
  } catch (e) {
    console.log("Problem in Getting Last Id for New Timeline.", e);
    return e;
  }
};

const getTimelineById = async (_id) => {
  try {
    const Timeline = Timeline.findOne({ _id: parseInt(_id) });
    return Timeline;
  } catch (e) {
    console.log("Problem in getTimelineById.", e);
    return e;
  }
};

module.exports = { createNewTimeline, getTimelineById };
