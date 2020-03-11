const Task = require('../Schemas/TaskSchema');
const bcrypt=require('bcrypt');


const getLastId=async()=>{
    try {
        const result = await Task.find()
            .sort({ _id: -1 })
            .limit(1);
        return result[0]._id;
    } catch (e) {
        console.log("Error while getting last Last ID.", e);
        return e;
    }
}

const createNewTask=async (name,description,pre_req,due_date,member_id_array)=>{
    try {
        let _id=await getLastId();
        _id=parseInt(_id);
        ++_id; 
        // let _id=1;
        const task = new Task({
            _id,
            name,
            description,
            pre_req,
            due_date,
            members:member_id_array
        });
        try {
            const result=await Task.create(task);
            return result;
        } catch (e) {
            console.log("Problem in Adding New Task.",e);
            return e;
        }
        
    } catch (e) {
        console.log("Problem in Getting Last Id for New Task.",e);
            return e;
    }
}

const getTaskById=async (_id)=>{
    try {
       
        const task = Task.findOne({_id:parseInt(_id)})
        .populate('members')
        .populate('comments')
        .populate('attachments')
        .populate('sub_tasks');
        return task;
    } catch (e) {
        console.log("Problem in getTaskById.",e);
            return e;
    }
}


const updateTaskStatus=async(_id,status)=>{
    try {
        const result=await Task.updateOne(
            {_id:parseInt(_id)},
            {status}
        );
        return result;
    } catch (e) {
        console.log("Problem in Updating Task Status",e);
        return e;
    }
}

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

module.exports={
    createNewTask,
    getTaskById,
    updateTaskStatus
};