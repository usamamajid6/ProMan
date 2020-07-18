const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      default: 1,
    },
    name: { type: String, default: "" },
    password: { type: String, default: "" },
    phone_number: { type: String, default: "" },
    email: {
      type: String,
      lowercase: true,
    },
    total_tasks: {
      type: Number,
      default: 0,
    },
    efficiency_score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema, "users");
