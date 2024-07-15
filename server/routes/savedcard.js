const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const cardController = require('../controllers/SavedCardController');

// Custom validation function for MM/YY format
const validateExpirationDate = (value) => {
    const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!regex.test(value)) {
        throw new Error('Invalid expiration date format');
    }
    return true;
};

// POST /api/cards/add
// Add a new card
router.post('/add', [
    check('userId').isMongoId().withMessage('Invalid user ID'),
    check('cardNumber').notEmpty().withMessage('Card number is required'),
    check('cardType').notEmpty().withMessage('Card type is required'),
    check('expiresDate').custom(validateExpirationDate).withMessage('Invalid expiration date format'),
    check('cvv').notEmpty().withMessage('CVV is required')
], cardController.addCard);

// GET /api/cards/user/:userId
// Get all cards of a user
router.get('/user/:userId', cardController.getUserCards);

router.delete('/:cardId', cardController.deleteCard)

module.exports = router;
