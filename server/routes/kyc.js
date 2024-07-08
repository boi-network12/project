const express = require("express");
const router = express.Router();
const { submitKyc } = require("../controllers/UserController");

router.post('/submit', submitKyc);

module.exports = router;
