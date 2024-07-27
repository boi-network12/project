const User = require("../models/user");
const Transaction = require("../models/transaction");
const { v4: uuidv4 } = require('uuid');

const sendMoney = async (req, res) => {
    const { senderId, recipientAccountNumber, amount, note } = req.body;
    const ipAddress = req.ip;

    try {
        const sender = await User.findById(senderId);

        if (!sender) {
            return res.status(404).json({
                error: "Sender not found",
                message: "Sender not found"
            });
        }

        // Ensure amount and balances are numbers
        const amountToSend = Number(amount);
        const senderBalance = Number(sender.balance);

        if (isNaN(amountToSend) || isNaN(senderBalance)) {
            return res.status(400).json({
                error: "Invalid amount",
                message: "Invalid amount"
            });
        }

        if (senderBalance < amountToSend) {
            return res.status(400).json({
                error: "Insufficient funds",
                message: "Insufficient Funds"
            });
        }

        const recipient = await User.findOne({ accountNumber: recipientAccountNumber });

        if (!recipient) {
            return res.status(404).json({
                error: "Recipient not found",
                message: "Recipient not found"
            });
        }

        // Ensure recipient balance is a number
        const recipientBalance = Number(recipient.balance);

        if (isNaN(recipientBalance)) {
            return res.status(400).json({
                error: "Invalid recipient balance",
                message: "Invalid recipient balance"
            });
        }

        // Deduct amount from sender's balance
        sender.balance = senderBalance - amountToSend;
        await sender.save();

        // Log updated sender balance
        console.log(`Sender balance after deduction: ${sender.balance}`);

        // Add amount to recipient's balance
        recipient.balance = recipientBalance + amountToSend;
        await recipient.save();

        // Log updated recipient balance
        console.log(`Recipient balance after addition: ${recipient.balance}`);

        // Generate a unique reference ID
        const referenceId = uuidv4();

        // Save transaction for sender
        const senderTransaction = new Transaction({
            referenceId,
            sender: senderId,
            recipient: recipient._id,
            amount: amountToSend,
            transactionType: 'transfer',
            note,
            ipAddress
        });
        await senderTransaction.save();

        // Save transaction for recipient
        const recipientTransaction = new Transaction({
            referenceId,
            sender: senderId,
            recipient: recipient._id,
            amount: amountToSend,
            transactionType: 'deposit',
            note,
            ipAddress
        });
        await recipientTransaction.save();

        res.status(200).json({
            message: "Money sent successfully",
            sender,
            recipient,
            referenceId
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    sendMoney
}
