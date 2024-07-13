const express = require("express");
const router = express.Router();
const {
    uploadKYC,
    confirmKYC,
    rejectKYC,
    getAllKYCRecords
} = require("../controllers/KycController");
const { validationResult, body } = require("express-validator");


// Route to upload KYC documents
router.post('/upload-kyc', [
    body('userId').isMongoId(),
    body('documentType').isIn(['passport', 'id_card', 'driver_license']),
    body('document').not().isEmpty(),
], (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty){
        return res.status(400).json({errors: errors.array()});
    }
    next();
});

// Route to confirm or reject KYC
router.post('/confirm-kyc', confirmKYC);
router.post('/reject-kyc', rejectKYC);

// Route to get all KYC records
router.get('/get-all-records', getAllKYCRecords);

module.exports = router;
