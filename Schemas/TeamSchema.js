const mongoose = require("mongoose");
const TeamSchema = new mongoose.Schema({
    _id: {
        type: Number,
        default: 1
    },
    name: {
        type: String,
        default: "",
        required: true
    },
    leader: {
        type: Number,
        ref: 'User'
    },
    project: {
        type: Number,
        ref: 'Project'
    },
    members: [
        {
           member:{
               type:Number,
               ref:'User'
           },
           total_tasks:{
               type:Number,
               default:0
           },
           efficiency_score:{
            type:Number,
            default:0
           }
        }
    ]
});

module.exports = mongoose.model("Team", TeamSchema, "teams");
