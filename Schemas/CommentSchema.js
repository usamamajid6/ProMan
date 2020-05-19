const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", CommentSchema, "comments");
