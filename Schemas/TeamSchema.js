const mongoose = require("mongoose");
const TeamSchema = new mongoose.Schema({
    _id: {
        type: Number,
        default: 1
    },
    name: {
        type: String,
        default: ""
    },
    description:{
        type: String,
        default: ""
    },
    leader: {
        type: Number,
        ref: 'User'
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