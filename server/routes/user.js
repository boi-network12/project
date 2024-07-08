const express = require("express");
const router = express.Router();
const { updateProfile, getUserDetails, submitKyc } = require("../controllers/UserController")

router.put('/profile', updateProfile);
router.get('/:userId', getUserDetails);
router.post('/kyc', submitKyc);

module.exports = router;