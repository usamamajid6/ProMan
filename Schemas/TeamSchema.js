const mongoose = require("mongoose");
const TeamSchema = new mongoose.Schema({
    _id: {
        type: Number,
        default: 1
    },
    name: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    leader: {
        type: Number,
        ref: 'User'
    },
    members:
    [
        {
            type: Number,
            ref: 'User'
        }
    ]
});

module.exports = mongoose.model("Team", TeamSchema, "teams");