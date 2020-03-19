const SubTask = require('../Schemas/SubTaskSchema');
const bcrypt=require('bcrypt');


const getLastId = async () => {
    try {
        const result = await SubTask.find()
            .sort({ _id: -1 })
            .limit(1);
        if(result.length===0){
            return 0;
        }else{
            return result[0]._id;
        }
    } catch (e) {
        console.log("Error while getting last Last ID.", e);
        return e;
    }
}

const createNewSubTask=async (name,description,member_id)=>{
    try {
        let _id=await getLastId();
        _id=parseInt(_id);
        ++_id; 
        // let _id=1;
        const subTask = new SubTask({
            _id,
            name,
            description,
            member:parseInt(member_id)
        });
        try {
            const result=await SubTask.create(subTask);
            return result;
        } catch (e) {
            console.log("Problem in Adding New SubTask.",e);
            return e;
        }
        
    } catch (e) {
        console.log("Problem in Getting Last Id for New SubTask.",e);
            return e;
    }
}

const getSubTaskById=async (_id)=>{
    try {
       
        const subTask = SubTask.findOne({_id:parseInt(_id)}).populate('member');
        return subTask;
    } catch (e) {
        console.log("Problem in getSubTaskById.",e);
            return e;
    }
}

module.exports={createNewSubTask,getSubTaskById};