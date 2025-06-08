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
    // Verificar se start_time é apenas um horário (HH:MM) e convertê-lo para um formato compatível
    let formattedStartTime = data.start_time;
    
    // Se start_time for apenas um horário (HH:MM), combiná-lo com a data para criar um timestamp
    if (typeof data.start_time === 'string' && data.start_time.match(/^\d{1,2}:\d{2}$/)) {
      // Extrair horas e minutos
      const [hours, minutes] = data.start_time.split(':').map(Number);
      
      // Criar um objeto Date com a data fornecida
      const dateObj = new Date(data.date);
      
      // Definir as horas e minutos
      dateObj.setHours(hours, minutes, 0, 0);
      
      // Formatar como timestamp ISO
      formattedStartTime = dateObj.toISOString();
    }
    
    const result = await db.query(
      'INSERT INTO bookings (user_id, room_id, start_time, status, date, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [data.user_id, data.room_id, formattedStartTime, data.status, data.date, data.description]
    );
    return result.rows[0];
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
