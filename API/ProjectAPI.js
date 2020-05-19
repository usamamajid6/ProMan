const Project = require('../Schemas/ProjectSchema');

const getLastId = async () => {
    try {
        const result = await Project.find()
            .sort({ _id: -1 })
            .limit(1);
        if (result.length === 0) {
            return 0;
        } else {
            return result[0]._id;
        }
    } catch (e) {
        console.log("Error while getting last Last ID.", e);
        return e;
    }
}

const createNewProject = async (name, start_date, end_date, project_type, leader_id, status) => {
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
            leader: leader_id
        });
        try {
            const result = await Project.create(project);
            return result;
        } catch (e) {
            console.log("Problem in Creating New Project!");
            return e;
        }
    } catch (e) {
        console.log("Problem in Getting Last Id!", e);
        return e;
    }
}

const getProjectById = async (_id) => {
    try {
        const result = await Project.findOne({ _id: parseInt(_id) })
            .populate('leader')
            .populate('timelines')
            .populate('members.member');
        // const result= await Project.find();
        return result;
    } catch (e) {
        console.log("Problem in Getting Project By Id", e);
        return e;
    }
}

const updateProjectLeader = async (_id, leader_id) => {
    try {
        const result = await Project.updateOne(
            { _id: parseInt(_id) },
            { leader: parseInt(leader_id) }
        );
        return result;
    } catch (e) {
        console.log("Problem in Updating Leader", e);
        return e;
    }
}

const updateProjectStatus = async (_id, status) => {
    try {
        const result = await Project.updateOne(
            { _id: parseInt(_id) },
            { status }
        );
        return result;
    } catch (e) {
        console.log("Problem in Updating Project Status", e);
        return e;
    }
}

const updateProjectType = async (_id, project_type) => {
    try {
        const result = await Project.updateOne(
            { _id: parseInt(_id) },
            { project_type }
        );
        return result;
    } catch (e) {
        console.log("Problem in Updating Project Type", e);
        return e;
    }
}

const updateProjectCost = async (_id, cost) => {
    try {
        const result = await Project.updateOne(
            { _id: parseInt(_id) },
            { cost }
        );
        return result;
    } catch (e) {
        console.log("Problem in Updating Leader", e);
        return e;
    }
}

const addTimeline = async (_id, timeline_id) => {
    try {
        const result = await Project.updateOne({ _id }, { $push: { timelines: timeline_id } });
        return result;
    } catch (e) {
        console.log("Problem in addTimeline", e);
        return e;
    }
}

const addMember = async (_id, member_id) => {
    try {
        const result = await Project.updateOne({ _id }, {
            $push: {
                members: {
                    _id: parseInt(member_id),
                    member: member_id,
                    total_tasks: 0,
                    efficiency_score: "0"
                }
            }
        });
        return result;
    } catch (e) {
        console.log("Problem in addMember", e);
        return e;
    }
}

const updateTTAES = async (_id, member_id, efficiency_score) => {
    try {
        const result = await Project.updateOne({ _id, "members._id": member_id }, {
            $inc: {
                "members.$.total_tasks": 1,
                "members.$.efficiency_score": parseInt(efficiency_score)
            }
        });
        return result;
    } catch (e) {
        console.log("Problem in addMember", e);
        return e;
    }
}



const getProjectsByMemberId = async member_id => {
    try {
        const result = await Project.find({ "members.member": member_id });
        return result;
    } catch (e) {
        console.log("Problem in getProjectsByMemberId", e);
        return e;
    }
}


module.exports = {
    createNewProject,
    getProjectById,
    updateProjectLeader,
    updateProjectStatus,
    updateProjectType,
    updateProjectCost,
    addTimeline,
    addMember,
    updateTTAES,
    getProjectsByMemberId
};