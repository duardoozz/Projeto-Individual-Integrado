const Notification = require('../models/notificationModel');

const notificationController = {
  async getAllNotifications(req, res) {
    try {
      const notifications = await Notification.getAllNotifications();
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getUnreadByUser(req, res) {
    try {
      const userId = parseInt(req.params.userId);
      const notifications = await Notification.getUnreadByUser(userId);
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createNotification(req, res) {
    try {
      const { user_id, booking_id, message } = req.body;
      const newNotification = await Notification.createNotification({ user_id, booking_id, message });
      res.status(201).json(newNotification);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async markAsRead(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updated = await Notification.markAsRead(id);
      if (!updated) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      res.json({ message: 'Notification marked as read', notification: updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = notificationController;
