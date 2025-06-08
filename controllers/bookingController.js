const Booking = require('../models/bookingModel');

const bookingController = {
  async getAllBookings(req, res) {
    try {
      const bookings = await Booking.getAllBookings();
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getBookingById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const booking = await Booking.getBookingById(id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json(booking);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createBooking(req, res) {
    try {
        const { user_id, room_id, start_time, status, date, description } = req.body;
        const newBooking = await Booking.createBooking({ user_id, room_id, start_time, status, date, description });
        res.status(201).json(newBooking);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
  },


  async updateBooking(req, res) {
    try {
        const bookingId = parseInt(req.params.id);
        const { status } = req.body;

        const updatedBooking = await Booking.updateBooking(bookingId, status);
        if (!updatedBooking) {
        return res.status(404).json({ message: 'Reserva não encontrada' });
        }

        res.json(updatedBooking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    },


  async deleteBooking(req, res) {
    try {
      const id = parseInt(req.params.id);
      const deletedBooking = await Booking.deleteBooking(id);
      if (!deletedBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json({ message: 'Booking deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = bookingController;