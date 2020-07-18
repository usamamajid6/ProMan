const mongoose = require("mongoose");
const ChatSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      default: 1,
    },
    message: String,
    member: {
      type: Number,
      ref: "User",
    },
    project: {
      type: Number,
      ref: "Project",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", ChatSchema, "chats");
