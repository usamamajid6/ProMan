const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
    _id: {
        type: Number,
        default: 1
    },
    name: {
        type: String,
        default: "",
        required: true
    },
    description: {
        type: String,
        default: "",
        required: true
    },
    pre_req: {
        type: Number,
        ref: "Task",
        default: 0
    },
    due_date: {
        type: Date
    },
    attachments: [
        {
            type: Number,
            ref: "Attachment"
        }
    ],
    comments: [
        {
            type: Number,
            ref: "Comment"
        }
    ],
    members: [
        {
            type: Number,
            ref: "User"
        }
    ],
    sub_tasks: [
        {
            type: Number,
            ref: "SubTask"
        }
    ]
});

module.exports = mongoose.model("Task", TaskSchema, "tasks");
