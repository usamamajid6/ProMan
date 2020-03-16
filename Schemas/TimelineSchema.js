const mongoose = require("mongoose");
const TimelineSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    content: String
});




module.exports = mongoose.model("Timeline", TimelineSchema,'timelines');