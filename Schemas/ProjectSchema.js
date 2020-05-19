const mongoose = require("mongoose");
const ProjectSchema = new mongoose.Schema({
    _id: {
        type: Number,
        default: 1
    },
    name: String,
    start_date: Date,
    end_date: Date,
    project_type: String,
    leader: {
        type: Number,
        ref: 'User'
    },
    members: [
        {
            _id: {
                type: Number
            },
            member: {
                type: Number,
                ref: 'User'
            },
            total_tasks: {
                type: Number,
                default: 0
            },
            efficiency_score: {
                type: Number,
                default: 0
            }
        }
    ],
    status: {
        type: String,
        default: "in-progress"
    },
    cost: {
        type: String,
        default: "Sorry No Information Provided"
    },
    timelines: [
        {
            type: Number,
            ref: 'Timeline',
            default: 0
        }
    ]
},{
    timestamps:true
});

module.exports = mongoose.model("Project", ProjectSchema, 'projects');