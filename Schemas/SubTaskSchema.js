const mongoose = require("mongoose");
const SubTaskSchema = new mongoose.Schema({
    _id: {
        type: Number,
        default:1
    },
    name: String,
    task: {
        type:Number,
        ref:'Task',
        default:0
    }
});




module.exports = mongoose.model("SubTask", SubTaskSchema,'subtasks');