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
    const { name, available} = roomData;
    const result = await db.query(
      `INSERT INTO rooms (name, available)
       VALUES ($1, $2) RETURNING *`,
      [name, available]
    );
    return result.rows[0];
  },

  async updateRoom(id, roomData) {
    const { name, available} = roomData;
    const result = await db.query(
      `UPDATE rooms SET name = $1, available = $2 WHERE id = $3 RETURNING *`,
      [name, available, id]
    );
    return result.rows[0];
  },

  async deleteRoom(id) {
    const result = await db.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Room;
