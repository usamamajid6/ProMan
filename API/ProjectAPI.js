const Project = require("../Schemas/ProjectSchema");
const UserAPI = require("./UserAPI");
const TimelineAPI = require("./TimelineAPI");
const NotificationAPI = require("./NotificationAPI");
const Emailer = require("../Email");
const getLastId = async () => {
  try {
    const result = await Project.find().sort({ _id: -1 }).limit(1);
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

const createNewProject = async (
  name,
  start_date,
  end_date,
  project_type,
  leader_id,
  description,
  cost
) => {
  try {
    let _id = await getLastId();
    _id = parseInt(_id);
    ++_id;
    start_date = new Date(start_date);
    end_date = new Date(end_date);
    leader_id = parseInt(leader_id);
    const project = new Project({
      _id,
      name,
      start_date,
      end_date,
      project_type,
      leader: leader_id,
      description,
      cost,
    });
    try {
      const result = await Project.create(project);
      let content = name + " project has been created!";
      await TimelineAPI.createNewTimeline(content, "blue", result._id);
      return result;
    } catch (e) {
      console.log("Problem in Creating New Project!");
      return e;
    }
  } catch (e) {
    console.log("Problem in Getting Last Id!", e);
    return e;
  }
};

const getProjectById = async (_id) => {
  try {
    const result = await Project.findOne({ _id: parseInt(_id) })
      .populate("leader")
      .populate("timelines")
      .populate("members.member");

    let data = result.toObject();
    let members = data.members;

    for (let i = 0; i < members.length; i++) {
      // const element = members[i];
      if (members[i].efficiency_score === 0) {
        members[i].efficiency = 0;
      } else {
        members[i].efficiency =
          members[i].efficiency_score / members[i].total_tasks;
      }
    }
    data.members = members;
    return data;
  } catch (e) {
    console.log("Problem in Getting Project By Id", e);
    return e;
  }
};

const updateProjectLeader = async (_id, leader_id) => {
  try {
    const result = await Project.updateOne(
      { _id: parseInt(_id) },
      { leader: parseInt(leader_id) }
    );
    const leader = await UserAPI.getUser(leader_id);
    let content = "Leader is changed to " + leader.name;
    await TimelineAPI.createNewTimeline(content, "gray", _id);
    return result;
  } catch (e) {
    console.log("Problem in Updating Leader", e);
    return e;
  }
};

const updateProjectStatus = async (_id, status) => {
  try {
    const result = await Project.updateOne({ _id: parseInt(_id) }, { status });
    let content = "Status of project changed to " + status;
    await TimelineAPI.createNewTimeline(content, "gray", _id);
    return result;
  } catch (e) {
    console.log("Problem in Updating Project Status", e);
    return e;
  }
};

const updateProjectType = async (_id, project_type) => {
  try {
    const result = await Project.updateOne(
      { _id: parseInt(_id) },
      { project_type }
    );
    let content = "Project type changed to " + project_type;
    await TimelineAPI.createNewTimeline(content, "gray", _id);
    return result;
  } catch (e) {
    console.log("Problem in Updating Project Type", e);
    return e;
  }
};

const updateProjectCost = async (_id, cost) => {
  try {
    const result = await Project.updateOne({ _id: parseInt(_id) }, { cost });
    let content = "Project cost's updated to " + cost;
    await TimelineAPI.createNewTimeline(content, "gray", _id);
    return result;
  } catch (e) {
    console.log("Problem in Updating Leader", e);
    return e;
  }
};

const updateProjectData = async (
  _id,
  name,
  description,
  status,
  project_type,
  cost,
  end_date
) => {
  try {
    const result = await Project.updateOne(
      { _id: parseInt(_id) },
      { name, description, status, cost, project_type, end_date }
    );
    let content = "Project's data updated";
    await TimelineAPI.createNewTimeline(content, "gray", _id);
    return result;
  } catch (e) {
    console.log("Problem in Updating Leader", e);
    return e;
  }
};

const addTimeline = async (_id, timeline_id) => {
  try {
    const result = await Project.updateOne(
      { _id },
      { $push: { timelines: timeline_id } }
    );
    return result;
  } catch (e) {
    console.log("Problem in addTimeline", e);
    return e;
  }
};

const addTimelineToProject = async (_id, timeline_id) => {
  try {
    const result = await Project.updateOne(
      { _id },
      { $push: { timelines: timeline_id } }
    );
    return result;
  } catch (e) {
    console.log("Problem in addTimeline", e);
    return e;
  }
};

const ifPresent = (array, _id) => {
  let found = false;
  for (let i = 0; i < array.length; i++) {
    if (array[i]._id === _id) {
      found = true;
      break;
    }
  }
  return found;
};

const addMember = async (_id, member_id) => {
  try {
    const result = await Project.updateOne(
      { _id },
      {
        $push: {
          members: {
            _id: parseInt(member_id),
            member: member_id,
            total_tasks: 0,
            efficiency_score: "0",
          },
        },
      }
    );
    const member = await UserAPI.getUser(member_id);
    let content = "New member " + member.name + " added to team.";
    await TimelineAPI.createNewTimeline(content, "green", _id);
    let data = await Project.findOne({ _id });
    let subject = "You added to Project!";
    let message =
      "<div> <b> AoA </b> </div>,<div> In Project:<b> " +
      data.name +
      "</b> you are added as a memeber </div> <div> Further details are: <b> " +
      data.description +
      "</b> .</div> <div> This Project's Start Date is: <b>" +
      data.start_date +
      "</b>.</div><div> This Project's End Date (Estimated) is: <b>" +
      data.end_date;
    Emailer.sendMail([member.email], subject, message);
    await NotificationAPI.createNewNotification(
      "Added to Project!",
      `You are added to Project:${data.name} as a member.`,
      member_id
    );
    return result;
  } catch (e) {
    console.log("Problem in addMember", e);
    return e;
  }
};

const addMembers = async (_id, member_id_array) => {
  try {
    const res = await Project.findById(_id);
    let members = res.members;

    for (let i = 0; i < member_id_array.length; i++) {
      const element = member_id_array[i];
      if (!ifPresent(members, element._id)) {
        let tempObj = {
          _id: parseInt(element._id),
          member: element._id,
          total_tasks: 0,
          efficiency_score: "0",
        };
        const member = await UserAPI.getUser(element._id);
        let content = "New member " + member.name + " added to team.";
        await TimelineAPI.createNewTimeline(content, "green", _id);
        members.push(tempObj);
      }
    }

    const result = await Project.updateOne({ _id }, { members });

    let data = await Project.findOne({ _id }).populate("members.member");
    let members_email_array = [];
    for (let i = 0; i < data.members.length; i++) {
      const element = data.members[i];
      members_email_array.push(element.member.email);
      await NotificationAPI.createNewNotification(
        "Added to Project!",
        `You are added to Project:${data.name} as a member.`,
        element.member._id
      );
    }
    let subject = "You added to New Project!";
    let message =
      "<div> <b> AoA </b> </div>,<div> A new Project:<b> " +
      data.name +
      "</b> is created and you are added as a memeber </div> <div> Further details are: <b> " +
      data.description +
      "</b> .</div> <div> This Project's Start Date is: <b>" +
      data.start_date +
      "</b>.</div><div> This Project's End Date (Estimated) is: <b>" +
      data.end_date;
    Emailer.sendMail(members_email_array, subject, message);

    return result;
  } catch (e) {
    console.log("Problem in addMember", e);
    return e;
  }
};

const updateTTAES = async (_id, member_id, efficiency_score) => {
  try {
    const result = await Project.updateOne(
      { _id, "members._id": member_id },
      {
        $inc: {
          "members.$.total_tasks": 1,
          "members.$.efficiency_score": parseInt(efficiency_score),
        },
      }
    );
    return result;
  } catch (e) {
    console.log("Problem in addMember", e);
    return e;
  }
};

const getProjectsByMemberId = async (member_id) => {
  try {
    const result = await Project.find({ "members.member": member_id }).sort({
      updatedAt: -1,
    });
    return result;
  } catch (e) {
    console.log("Problem in getProjectsByMemberId", e);
    return e;
  }
};

module.exports = {
  createNewProject,
  getProjectById,
  updateProjectLeader,
  updateProjectStatus,
  updateProjectType,
  updateProjectCost,
  addTimeline,
  addMember,
  addMembers,
  updateTTAES,
  getProjectsByMemberId,
  addTimelineToProject,
  updateProjectData,
};
