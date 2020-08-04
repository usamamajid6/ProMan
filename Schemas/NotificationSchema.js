const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      default: 1,
    },
    name: String,
    description: String,
    member: {
      type: Number,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  NotificationSchema,
  "notifications"
);
