const User = require('../Schemas/UserSchema');
const bcrypt=require('bcrypt');

const isEmailUnique=async(email)=>{
    try {
        const result = await User.findOne({ email });
        return result;
    } catch (e) {
        console.log("Error in isEmailUnique method.", e);
        return e;
    }
}

const getLastId=async()=>{
    try {
        const result = await User.find()
            .sort({ _id: -1 })
            .limit(1);
        return result[0]._id;
    } catch (e) {
        console.log("Error while getting last Last ID.", e);
        return e;
    }
}

const registerUser=async (name,email,password,phone_number)=>{
    try {
        let _id=await getLastId();
        _id=parseInt(_id);
        ++_id; 
        // let _id=1;
        password=await bcrypt.hash(password, 10);
        const user = new User({
            _id,
            name,
            email,
            password,
            phone_number
        });
        try {
            const result=await User.create(user);
            return result;
        } catch (e) {
            console.log("Problem in Adding New User.",e);
            return e;
        }
        
    } catch (e) {
        console.log("Problem in Getting Last Id for New User.",e);
            return e;
    }
}

const loginUser=async(email,password)=>{
    try {
        const user=await User.findOne({email});
        if(user){
            try {
                //user email found
                const hashPassword=user.password;
                const comparePasswordResult=await bcrypt.compare(password,hashPassword);
                if(comparePasswordResult){
                    //Password Matches
                    return user;
                }else{
                    //Password didn't match
                    return comparePasswordResult;
                }
                
            } catch (e) {
                console.log("Problem in Comparing Hash Password.",e);
                return e;
            }
        }else{
            //user email not exists
            return user;
        }
        
    } catch (e) {
        console.log("Problem in loginUser.",e);
        return e;
    }
}

const getUser=async(_id)=>{
    try {
        const user = await User.findOne({_id:parseInt(_id)});
        return user;
    } catch (e) {
        console.log("Problem in getUser",e);
        return e;
    }
}

const updateUser=async(_id,name)=>{
    try {
        const user = await User.updateOne({_id},{name});
        return user;
    } catch (e) {
        console.log("Problem in updateUser",e);
        return e;
    }
}

const getAllUsers=async()=>{
    try {
        const users = await User.find();
        return users;
    } catch (e) {
        console.log("Problem in getAllUsers",e);
        return e;
    }
}

const addProject=async (_id,project_id)=>{
    try {
        const result = await User.updateOne({_id},{$push:{projects:project_id}});
        return result;
    } catch (e) {
        console.log("Problem in getAllUsers",e);
        return e;
    }
}
//updateTotalTasksAndEfficiencyScore
const updateTTAES=async(_id,efficiency_score)=>{
    try {
        _id = parseInt(_id);
        efficiency_score = parseInt(efficiency_score);
        const result = await User.updateOne(
            {_id},
            {
                $inc:{efficiency_score,total_tasks:1}
            }
        );
        return result;
    } catch (e) {
        console.log("Problem in getAllUsers",e);
        return e;
    }
}

module.exports={registerUser,loginUser,isEmailUnique,getUser,updateUser,getAllUsers,addProject,updateTTAES};