const mongoose = require("mongoose");
const SubTaskSchema = new mongoose.Schema({
    _id: {
        type: Number,
        default:1
    },
    name: String,
    description:String,
    status: {
        type:String,
        default:"in-progress"
    },
    member:{
        type:Number,
        default:0,
        ref:'User'
    }
});




module.exports = mongoose.model("SubTask", SubTaskSchema,'subtasks');