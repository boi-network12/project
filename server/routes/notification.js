const express = require('express');
const router = express.Router();
const { markNotificationAsRead } = require('../controllers/UserController');

router.get('/:notificationId/read', markNotificationAsRead);

module.exports = router;
