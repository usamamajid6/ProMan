const mongoose = require("mongoose");
const ProjectSchema = new mongoose.Schema({
    _id: {
        type: Number,
        default:1
    },
    name: String,
    start_date:Date,
    end_date:Date,
    project_type:String,
    leader:{
        type:Number,
        ref:'User'
    },
    status:{
        type:String,
        default:""
    },
    cost:{
        type:String,
        default:""
    },
    timeline:[
        {
            type:Number,
            ref:'Timeline',
            default:0
        }
    ]
});

module.exports = mongoose.model("Project", ProjectSchema,'projects');