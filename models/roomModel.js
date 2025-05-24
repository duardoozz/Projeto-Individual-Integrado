const db = require('../config/db');

const Room = {
  async getAllRooms() {
    const result = await db.query('SELECT * FROM rooms');
    return result.rows;
  },

  async getRoomById(id) {
    const result = await db.query('SELECT * FROM rooms WHERE id = $1', [id]);
    return result.rows[0];
  },

  async createRoom(roomData) {
    const { name, capacity, location, available, availability_start, availability_end, created_by } = roomData;
    const result = await db.query(
      `INSERT INTO rooms (name, capacity, location, available, availability_start, availability_end, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, capacity, location, available, availability_start, availability_end, created_by]
    );
    return result.rows[0];
  },

  async updateRoom(id, roomData) {
    const { name, capacity, location, available, availability_start, availability_end, created_by } = roomData;
    const result = await db.query(
      `UPDATE rooms SET name = $1, capacity = $2, location = $3, available = $4, 
       availability_start = $5, availability_end = $6, created_by = $7 WHERE id = $8 RETURNING *`,
      [name, capacity, location, available, availability_start, availability_end, created_by, id]
    );
    return result.rows[0];
  },

  async deleteRoom(id) {
    const result = await db.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Room;
