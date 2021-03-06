const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      default: 1,
    },
    name: {
      type: String,
      default: "",
      required: true,
    },
    description: {
      type: String,
      default: "",
      required: true,
    },
    pre_req: {
      type: Number,
      ref: "Task",
      default: 0,
    },
    task_list: {
      type: Number,
      ref: "TaskList",
      default: 0,
    },
    project: {
      type: Number,
      ref: "Project",
      default: 0,
    },
    due_date: {
      type: Date,
    },
    status: {
      type: String,
      default: "in-progress",
    },
    attachments: [
      {
        type: Number,
        ref: "Attachment",
      },
    ],
    comments: [
      {
        type: Number,
        ref: "Comment",
      },
    ],
    members: [
      {
        _id: Number,
        member: {
          type: Number,
          ref: "User",
        },
        task_status: String,
        last_updated_on: Date,
      },
    ],
    sub_tasks: [
      {
        type: Number,
        ref: "SubTask",
      },
    ],
    subscriber: [
      {
        type: Number,
        ref: "User",
      },
    ],
    OneHourNotification: {
      type: Number,
      default: 0,
    },
    SixHourNotification: {
      type: Number,
      default: 0,
    },
    TwelveHourNotification: {
      type: Number,
      default: 0,
    },
    OneDayNotification: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TaskSchema, "tasks");
