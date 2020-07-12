const mongoose = require("mongoose");
const TimelineSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    content: String,
    type: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Timeline", TimelineSchema, "timelines");
