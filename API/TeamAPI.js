const Team = require("../Schemas/TeamSchema");
const NotificationAPI = require("./NotificationAPI");
const Emailer = require("../Email");
const getLastId = async () => {
  try {
    const result = await Team.find().sort({ _id: -1 }).limit(1);
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

const createNewTeam = async (name, description, leader_id) => {
  try {
    let _id = await getLastId();
    _id = parseInt(_id);
    ++_id;
    // let _id = 1;

    const team = new Team({
      _id,
      name,
      description,
      leader: parseInt(leader_id),
    });
    try {
      const result = await Team.create(team);
      return result;
    } catch (e) {
      console.log("Problem in Adding New Team.", e);
      return e;
    }
  } catch (e) {
    console.log("Problem in Getting Last Id for New Team.", e);
    return e;
  }
};

const getTeamById = async (_id) => {
  try {
    const team = Team.findOne({ _id: parseInt(_id) })
      .populate("leader")
      .populate("projects")
      .populate("members");
    return team;
  } catch (e) {
    console.log("Problem in getTeamById.", e);
    return e;
  }
};

const addProject = async (_id, project_id) => {
  try {
    const result = await Team.updateOne(
      { _id },
      { $push: { projects: project_id } }
    );
    return result;
  } catch (e) {
    console.log("Problem in addProject", e);
    return e;
  }
};

const addMember = async (_id, member_id) => {
  try {
    const result = await Team.updateOne(
      { _id },
      { $push: { members: member_id } }
    );
    let data = await Team.findOne({ _id });
    let subject = "You added to Team!";
    let message =
      "<div> <b> AoA </b> </div>,<div> In Team:<b> " +
      data.name +
      "</b> you are added as a memeber </div> ";
    Emailer.sendMail([member_id], subject, message);
    await NotificationAPI.createNewNotification(
      "Added To Team!",
      `You have been added to Team: ${data.name}`,
      member_id
    );
    return result;
  } catch (e) {
    console.log("Problem in addMember", e);
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

const addMembers = async (_id, member_id_array) => {
  try {
    const res = await Team.findById(_id);
    let members = res.members;
    for (let i = 0; i < member_id_array.length; i++) {
      const element = member_id_array[i];
      if (!ifPresent(members, element)) {
        members.push(element);
      }
    }

    const result = await Team.updateOne({ _id }, { members });

    let data = await Team.findOne({ _id }).populate("members");
    let members_email_array = [];
    for (let i = 0; i < data.members.length; i++) {
      const element = data.members[i];
      members_email_array.push(element.email);
      await NotificationAPI.createNewNotification(
        "Added To New Team!",
        `You have been added to Team: ${data.name}`,
        element._id
      );
    }
    let subject = "You added to New Team!";
    let message =
      "<div> <b> AoA </b> </div>,<div> A new Team:<b> " +
      data.name +
      "</b> is created and you are added as a memeber </div> ";
    Emailer.sendMail(members_email_array, subject, message);

    return result;
  } catch (e) {
    console.log("Problem in addMember", e);
    return e;
  }
};
//update Efficiency Score and Total Tasks Of Member(ESATTOM)
const updateESATTOM = () => {};

const getTeamsByMemberId = async (member_id) => {
  try {
    const result = await Team.find({ members: member_id })
      .populate("projects")
      .populate("members");
    return result;
  } catch (e) {
    console.log("Problem in getTeamsByMemberId", e);
    return e;
  }
};

module.exports = {
  createNewTeam,
  getTeamById,
  addMember,
  addMembers,
  updateESATTOM,
  addProject,
  getTeamsByMemberId,
};
