const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    rollno: {
        type: String,
        required: [true, "Roll number is mandatory"]
    },
    time: {
        type: Date,
        required: [true, "Time is required"]
    }
}, { timestamps: true });

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
