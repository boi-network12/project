const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the schema for user
const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    otherName: {
        type: String,
        default: ""  // Default to an empty string if not provided
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    profilePicture: {
        type: String,
        default: ""  // Default to an empty string if not provided
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
    },
    status: {
        type: String,
        default: ""  // Default to an empty string if not provided
    },
    balance: {
        type: Number,
        default: 0,
    },
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: "Transaction"
    }],
    kycVerified: {
        type: Boolean,
        default: false
    },
    limit: {
        type: Number,
        default: 500000,
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    nextOfKin: [{
        type: Schema.Types.ObjectId,
        ref: "NextOfKin",
        required: true
    }]
    ,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});



// Define instance methods
UserSchema.methods.upgradeLimit = function() {
    if (this.kycVerified) {
        this.limit = Number.MAX_SAFE_INTEGER;
    }
};

// Export the model
module.exports = mongoose.model("User", UserSchema);
