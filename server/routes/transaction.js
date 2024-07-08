const express = require("express");
const router = express.Router();
const { getUserTransactions, payBill } = require("../controllers/UserController");

router.get('/:userId/transactions', getUserTransactions);
router.post('/pay', payBill);

module.exports = router;
