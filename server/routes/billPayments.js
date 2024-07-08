const express = require("express");
const router = express.Router();
const { payBill } = require("../controllers/UserController");

router.post('/pay', payBill);

module.exports = router;
