const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    _id: {
        type: Number,
        default:1
    },
    name: String,
    password: String,
    phone_number:String,
    email: {
        type:String,
        lowercase:true
    },
    total_tasks: {
        type: Number,
        default: 0
    },
    efficiency_score: {
        type: Number,
        default: 0
    }
});




module.exports = mongoose.model("User", UserSchema,'users');