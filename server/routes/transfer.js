const express = require('express');
const router = express.Router();
const { sendMoney } = require('../controllers/TransferController');
const User = require("../models/user")

// Route to send money
router.post('/send', sendMoney);

// Fetch user detais by account number 
router.get('/:accountNumber', async (req, res) => {
    const { accountNumber } = req.params

    try {
        const user = await User.findOne({ accountNumber })

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            otherName: user.otherName,
        })
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
})

module.exports = router;
