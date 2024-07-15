// controllers/cardController.js

const Card = require('../models/SavedCard');
const { validationResult } = require('express-validator');

// Add a new card for a user
// Update addCard in cardController.js
const addCard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { userId, cardNumber, cardType, expiresDate, cvv, cardHolder } = req.body;

  try {
      // Create new card instance
      const card = new Card({
          userId,
          cardNumber,
          cardType,
          expiresDate,
          cardHolder,
          cvv
      });

      await card.save();

      res.status(201).json({ message: "Card added successfully", card });

  } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server Error' });
  }
};

  

// Get all cards of a user
const getUserCards = async (req, res) => {
    const userId = req.params.userId;

    try {
        const cards = await Card.find({ userId });

        res.status(200).json({ message: "User cards retrieved successfully", cards });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a card
const deleteCard = async (req, res) => {
    const cardId = req.params.cardId;

    try {
        const card = await Card.findById(cardId);

        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        await card.deleteOne(); // Assuming card.remove() is the correct method to delete the document

        res.status(200).json({ message: "Card deleted successfully" });

    } catch (error) {
        console.error("Failed to delete card:", error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    addCard,
    getUserCards,
    deleteCard
};
