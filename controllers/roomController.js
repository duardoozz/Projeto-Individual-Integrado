const Room = require('../models/roomModel');

const roomController = {
  async getAllRooms(req, res) {
    try {
      const rooms = await Room.getAllRooms();
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getRoomById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const room = await Room.getRoomById(id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json(room);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createRoom(req, res) {
    try {
      const roomData = req.body;
      const newRoom = await Room.createRoom(roomData);
      res.status(201).json(newRoom);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateRoom(req, res) {
    try {
      const id = parseInt(req.params.id);
      const roomData = req.body;
      const updatedRoom = await Room.updateRoom(id, roomData);
      if (!updatedRoom) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json(updatedRoom);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async deleteRoom(req, res) {
    try {
      const id = parseInt(req.params.id);
      const deletedRoom = await Room.deleteRoom(id);
      if (!deletedRoom) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json({ message: 'Room deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = roomController;
