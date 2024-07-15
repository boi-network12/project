const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cardNumber: {
        type: String,
        required: true,
        unique: true
    },
    cardType: {
        type: String,
        required: true
    },
    cardHolder: {
        type: String,
        required: true
    },
    expiresDate: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Card', cardSchema);
