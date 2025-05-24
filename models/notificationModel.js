const db = require('../config/db');

const Notification = {
  async getAllNotifications() {
    const result = await db.query('SELECT * FROM notifications ORDER BY sent_at DESC');
    return result.rows;
  },

  async getUnreadByUser(userId) {
    const result = await db.query(
      'SELECT * FROM notifications WHERE user_id = $1 AND was_read = FALSE ORDER BY sent_at DESC',
      [userId]
    );
    return result.rows;
  },

  async createNotification({ user_id, booking_id, message }) {
    const result = await db.query(
      `INSERT INTO notifications (user_id, booking_id, message)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, booking_id, message]
    );
    return result.rows[0];
  },

  async markAsRead(id) {
    const result = await db.query(
      'UPDATE notifications SET was_read = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
};

module.exports = Notification;
