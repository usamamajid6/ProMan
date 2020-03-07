const mongoose = require("mongoose");
const AttachmentSchema = new mongoose.Schema({
    _id: {
        type: Number,
        default:1
    },
    name: String,
    path: String
});




module.exports = mongoose.model("Attachment", AttachmentSchema,'attachments');