const TaskList = require('../Schemas/TaskListSchema');
const bcrypt=require('bcrypt');


const getLastId=async()=>{
    try {
        const result = await TaskList.find()
            .sort({ _id: -1 })
            .limit(1);
        return result[0]._id;
    } catch (e) {
        console.log("Error while getting last Last ID.", e);
        return e;
    }
}

const createNewTaskList=async (name,project_id)=>{
    try {
        let _id=await getLastId();
        _id=parseInt(_id);
        ++_id; 
        // let _id=1;
        const taskList = new TaskList({
            _id,
            name,
            project:parseInt(project_id)
        });
        try {
            const result=await TaskList.create(taskList);
            return result;
        } catch (e) {
            console.log("Problem in Adding New TaskList.",e);
            return e;
        }
        
    } catch (e) {
        console.log("Problem in Getting Last Id for New TaskList.",e);
            return e;
    }
}

const getTaskListById=async (_id)=>{
    try {
       
        const taskList = TaskList.findOne({_id:parseInt(_id)}).populate('member');
        return taskList;
    } catch (e) {
        console.log("Problem in getTaskListById.",e);
            return e;
    }
}

module.exports={createNewTaskList,getTaskListById};