const db = require('../config/db');

class Booking {
  static async getAllBookings() {
    const result = await db.query('SELECT * FROM bookings ORDER BY date, start_time');
    return result.rows;
  }

  static async getBookingById(id) {
    const result = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getBookingsByUserId(userId) {
    const result = await db.query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY date, start_time', [userId]);
    return result.rows;
  }

  static async createBooking(data) {
    try {
      let formattedStartTime = data.start_time;
      
      if (typeof data.start_time === 'string' && !data.start_time.match(/^\d{1,2}:\d{2}$/)) {
        const timeMatch = data.start_time.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          formattedStartTime = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
        }
      }
      
      const fullTimestamp = `${data.date} ${formattedStartTime}:00`;
      
      console.log('Inserindo no banco com timestamp completo:', {
        user_id: data.user_id,
        room_id: data.room_id,
        start_time: fullTimestamp,
        status: data.status,
        date: data.date,
        description: data.description
      });
      
      const result = await db.query(
        'INSERT INTO bookings (user_id, room_id, start_time, status, date, description) VALUES ($1, $2, $3::timestamp, $4, $5, $6) RETURNING *',
        [data.user_id, data.room_id, fullTimestamp, data.status, data.date, data.description]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Erro detalhado ao criar reserva:', err);
      throw err;
    }
  }

  static async updateBooking(id, data) {
    const result = await db.query(
      'UPDATE bookings SET user_id = $1, room_id = $2, start_time = $3, status = $4, date = $5, description = $6 WHERE id = $7 RETURNING *',
      [data.user_id, data.room_id, data.start_time, data.status, data.date, data.description, id]
    );
    return result.rows[0];
  }

  static async deleteBooking(id) {
    const result = await db.query('DELETE FROM bookings WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Booking;
