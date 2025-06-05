const db = require('../config/db');

const Booking = {
  async getAllBookings() {
    const result = await db.query('SELECT * FROM bookings');
    return result.rows;
  },

  async getBookingById(id) {
    const result = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
    return result.rows[0];
  },

  async createBooking(bookingData) {
    const { user_id, room_id, start_time, status } = bookingData;
    const result = await db.query(
      `INSERT INTO bookings (user_id, room_id, start_time, status)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, room_id, start_time, status]
    );
    return result.rows[0];
  },

  async updateBooking(id, bookingData) {
    const { user_id, room_id, start_time, status } = bookingData;
    const result = await db.query(
      `UPDATE bookings SET user_id = $1, room_id = $2, start_time = $3, 
      status = $4 WHERE id = $5 RETURNING *`,
      [user_id, room_id, start_time, status, id]
    );
    return result.rows[0];
  },

  async deleteBooking(id) {
    const result = await db.query('DELETE FROM bookings WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Booking;
