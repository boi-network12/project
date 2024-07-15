const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Schema for otp
const otpSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    }
});

// Export the model
module.exports = mongoose.model("OTP", otpSchema);
