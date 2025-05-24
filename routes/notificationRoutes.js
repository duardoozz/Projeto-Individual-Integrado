const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/', notificationController.getAllNotifications);
router.get('/unread/:userId', notificationController.getUnreadByUser);
router.post('/', notificationController.createNotification);
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
