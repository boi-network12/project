const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for transaction
const TransactionSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    timestamp: {  // Changed to lowercase 'timestamp'
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    transactionType: {
        type: String,
        enum: ['transfer', 'deposit', 'withdrawal'],
        required: true
    },
    note: {
        type: String,
        required: false
    },
    ipAddress: {
        type: String,
        required: true
    }
});

// NOTE: for the note it can be the description or the note user can implement it or user can not 
// 
// 
// Optional: Add hooks for updating user balances
TransactionSchema.post('save', async function(doc) {
    const User = mongoose.model('User');
    try {
        if (doc.status === 'completed') {
            const sender = await User.findById(doc.sender);
            const recipient = await User.findById(doc.recipient);

            if (sender && recipient) {
                sender.balance -= doc.amount;
                recipient.balance += doc.amount;
                await sender.save();
                await recipient.save();
            }
        }
    } catch (error) {
        console.error("Error updating user balances after transaction save:", error);
    }
});

// Export the model
module.exports = mongoose.model("Transaction", TransactionSchema);
