const mongoose = require("mongoose");
const TaskListSchema = new mongoose.Schema({
  _id: {
    type: Number,
    default: 1,
  },
  name: String,
  description: String,
  project: {
    type: Number,
    default: 0,
    ref: "Project",
  },
  tasks: [
    {
      type: Number,
      ref: "Task",
    },
  ],
},{
    
  timestamps:true
});

module.exports = mongoose.model("TaskList", TaskListSchema, "tasklists");
