const KYC = require("../models/kyc");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const uploadKYC = [
    upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'ninImage', maxCount: 1 }
    ]),
    async (req, res) => {
        const { userId, otherName, documentType, documentNumber } = req.body;
        const profilePicture = req.files && req.files['profilePicture'] ? req.files['profilePicture'][0].path : "";
        const ninImage = req.files && req.files['ninImage'] ? req.files['ninImage'][0].path : "";

        try {
            // Validate user
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found", message: "User not found" });
            }

            // Update User's otherName and profilePicture
            if (otherName) user.otherName = otherName;
            if (profilePicture) user.profilePicture = profilePicture;
            await user.save();

            // Create or update KYC record
            let kyc = await KYC.findOne({ user: userId });
            if (kyc) {
                kyc.documentType = documentType;
                kyc.documentNumber = documentNumber;
                kyc.profilePicture = profilePicture;
                kyc.ninImage = ninImage;
                kyc.otherName = otherName;
            } else {
                kyc = new KYC({
                    user: userId,
                    documentType,
                    documentNumber,
                    verified: false,
                    profilePicture,
                    ninImage,
                    otherName
                });
            }

            await kyc.save();
            res.status(200).json({ message: 'KYC data submitted successfully', kyc });
        } catch (error) {
            console.error("Error submitting KYC:", error);
            res.status(500).json({ error: 'Failed to submit KYC data', message: error.message });
        }
    }
];


const confirmKYC = async (req, res) => {
    const { kycId, isApproved } = req.body;

    try {
        const kyc = await KYC.findById(kycId);
        if (!kyc) {
            return res.status(404).json({ error: "KYC record not found", message: "KYC record not found" });
        }

        kyc.verified = isApproved;
        await kyc.save();

        // Update user KYC status
        const user = await User.findById(kyc.user);
        if (user) {
            user.kycVerified = isApproved;
            if (isApproved) {
                user.upgradeLimit();  // Upgrade user limit if KYC is approved
            }
            await user.save();
        }

        res.status(200).json({ message: isApproved ? "KYC confirmed successfully" : "KYC rejected successfully", kyc });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const rejectKYC = async (req, res) => {
    const { kycId } = req.body;

    try {
        const kyc = await KYC.findById(kycId);
        if (!kyc) {
            return res.status(404).json({ error: "KYC record not found", message: "KYC record not found" });
        }

        kyc.verified = false;
        await kyc.save();

        // Update user KYC status
        const user = await User.findById(kyc.user);
        if (user) {
            user.kycVerified = false;
            await user.save();
        }

        res.status(200).json({ message: "KYC rejected successfully", kyc });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllKYCRecords = async (req, res) => {
    try {
        const kycs = await KYC.find().populate('user', 'firstName lastName email');
        res.status(200).json({ message: "KYC records retrieved successfully", kycs });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    //submitKyc, // This can be removed if no longer needed
    uploadKYC,
    confirmKYC,
    rejectKYC,
    getAllKYCRecords,
};
