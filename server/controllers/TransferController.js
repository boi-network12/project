// send money (Transfer)
const User = require("../models/user")
const  Transaction = require("../models/transaction")

const sendMoney = async (req, res) => {
    const { senderId, recipientAccountNumber, amount } = req.body

    try {
        const sender = await User.findById(senderId)
        
        if(!sender) {
            return res.status(404).json({
                error: "sender not found",
                message: "Sender not fount"
            })
        }

        
        if(sender.balance < amount){
                return res.status(400).json({
                    error: "Insufficient funds",
                    message: "Insufficient Funds"
                })
        }

        const recipient = await User.findById({ accountNumber: recipientAccountNumber })

        if(!recipient){
            return res.status(404).json({
                error: "Recipient not found",
                message: "Recipient not found"
            })
        }

        // Deduct amount from sender's balance
        sender.balance -= amount

        // save transaction for sender
        const senderTransaction = new Transaction({
            sender: senderId,
            recipient: recipient._id,
            amount,
            transactionType: 'transfer'
        })
        await senderTransaction.save()

        // Add amount to recipient's balance
        recipient.balance += amount

        // save transaction for recipient
        const recipientTransaction = new Transaction({
            sender: senderId,
            recipient: recipient._id,
            amount,
            transactionType: 'deposit'
        })
        await recipientTransaction.save()

        // save updated balances
        await sender.save()
        await recipient.save()

        res.status(200).json({
            message: "Money sent successFully",
            sender,
            recipient
        })


    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    sendMoney
}