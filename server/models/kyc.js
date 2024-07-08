const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const KYCSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    documentType: {
        type: String,
        enum: ['passport', 'id_card', 'driver_license'],
        required: true
    },
    documentNumber: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

KYCSchema.post('save', async function(doc) {
    const User = mongoose.model('User');
    try {
        const user = await User.findById(doc.user);
        if (user) {
            user.kycVerified = doc.verified;
            if (doc.verified) {
                user.upgradeLimit(); // upgrade user limit if KYC is verified
            }
            await user.save();
        }
    } catch (error) {
        console.error("Error updating user after KYC save:", error);
    }
});

module.exports = mongoose.model('KYC', KYCSchema);
