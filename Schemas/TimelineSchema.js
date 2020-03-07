const mongoose = require("mongoose");
const TimelineSchema = new mongoose.Schema({
    _id: {
        type: Number,
        default:1
    },
    content: String
});




module.exports = mongoose.model("Timeline", TimelineSchema,'timelines');