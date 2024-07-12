const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
    uploadKYC,
    confirmKYC,
    rejectKYC,
    getAllKYCRecords
} = require("../controllers/UserController");

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

// Route to upload KYC documents
router.post('/upload-kyc', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'ninImage', maxCount: 1 }
]), uploadKYC);

// Route to confirm or reject KYC
router.post('/confirm-kyc', confirmKYC);
router.post('/reject-kyc', rejectKYC);

// Route to get all KYC records
router.get('/get-all-records', getAllKYCRecords);

module.exports = router;
