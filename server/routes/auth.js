const express = require("express");
const router = express.Router();
const { login, register, deleteUser, updateEmail } = require("../controllers/UserController");
const verifyToken = require("../middleware/authentication");
const User = require('../models/user');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.delete('/delete/:userId', verifyToken, deleteUser)

// Authenticated route
router.get('/me', verifyToken, async (req, res) => {
  try {
      console.log('Fetching user with ID:', req.user.id); // Log the user ID
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (err) {
      console.error('Error retrieving user:', err); // Log the error
      res.status(500).json({ message: 'Server error' });
  }
});

router.put('/change-email', verifyToken, updateEmail);


module.exports = router;
