const express = require("express");
const router = express.Router();
const { updateProfile, getUserDetails, submitKyc, updateStatus } = require("../controllers/UserController")

router.put('/profile', updateProfile);
router.get('/:userId', getUserDetails);
router.post('/kyc', submitKyc);
router.put('/status/:userId', updateStatus);

module.exports = router;
