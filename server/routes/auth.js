const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/UserController");
const verifyToken = require("../middleware/authentication");

// Public routes
router.post('/register', register);
router.post('/login', login);

// Authenticated route
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
