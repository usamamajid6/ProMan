const Project = require('../Schemas/ProjectSchema');

const getLastId=async()=>{
    try {
        const result = await Project.find()
            .sort({ _id: -1 })
            .limit(1);
        return result[0]._id;
    } catch (e) {
        console.log("Error while getting last Last ID.", e);
        return e;
    }
}

const createNewProject=async(name,start_date,end_date,project_type,leader_id,status)=>{
    try {
        let _id=await getLastId();
        _id=parseInt(_id);
        ++_id;
        start_date=new Date(start_date);
        end_date=new Date(end_date);
        leader_id=parseInt(leader_id);
        const project=new Project({
            _id,
            name,
            start_date,
            end_date,
            project_type,
            leader:leader_id,
            status
        });
        try {
            const result=await Project.create(project);
            return result;
        } catch (e) {
            console.log("Problem in Creating New Project!");
            return e;
        }
    } catch (e) {
        console.log("Problem in Getting Last Id!",e);
        return e;
    }
}

const getProjectById=async(_id)=>{
    try {
        const result=await Project.findOne({_id:parseInt(_id)}).populate('leader');
        return result;
    } catch (e) {
        console.log("Problem in Getting Project By Id",e);
        return e;
    }
}

const updateProjectLeader=async(_id,leader_id)=>{
    try {
        const result=await Project.updateOne(
            {_id:parseInt(_id)},
            {leader:parseInt(leader_id)}
        );
        return result;
    } catch (e) {
        console.log("Problem in Updating Leader",e);
        return e;
    }
}

const updateProjectStatus=async(_id,status)=>{
    try {
        const result=await Project.updateOne(
            {_id:parseInt(_id)},
            {status}
        );
        return result;
    } catch (e) {
        console.log("Problem in Updating Leader",e);
        return e;
    }
}

const updateProjectType=async(_id,project_type)=>{
    try {
        const result=await Project.updateOne(
            {_id:parseInt(_id)},
            {project_type}
        );
        return result;
    } catch (e) {
        console.log("Problem in Updating Leader",e);
        return e;
    }
}

const updateProjectCost=async(_id,cost)=>{
    try {
        const result=await Project.updateOne(
            {_id:parseInt(_id)},
            {cost}
        );
        return result;
    } catch (e) {
        console.log("Problem in Updating Leader",e);
        return e;
    }
}

module.exports={
    createNewProject,
    getProjectById,
    updateProjectLeader,
    updateProjectStatus,
    updateProjectType,
    updateProjectCost
};