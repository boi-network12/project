const express = require('express');
const router = express.Router();
const { sendMoney } = require('../controllers/TransferController');

// Route to send money
router.post('/send', sendMoney);

module.exports = router;
