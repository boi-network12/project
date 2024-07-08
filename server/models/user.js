const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

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
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user', // Set default role to 'user'
    },
    status: {
        type: String,
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
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


// password hashing
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Define instance methods
UserSchema.methods.upgradeLimit = function() {
    if (this.kycVerified) {
        this.limit = Number.MAX_SAFE_INTEGER;
    }
};

// Export the model
module.exports = mongoose.model("User", UserSchema);
