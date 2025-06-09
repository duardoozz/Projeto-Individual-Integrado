const express = require('express');
const router = express.Router();
const path = require('path');
const Booking = require('../models/bookingModel');
const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.get('/', async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      return res.redirect('/auth/login');
    }
    const bookings = await Booking.getBookingsByUserId(userId);
    res.render(path.join(__dirname, '../views/pages/page1'), { bookings });
  } catch (err) {
    console.error('Erro ao buscar reservas:', err);
    res.status(500).send('Erro ao buscar reservas');
  }
});

router.get('/bookings', (req, res) => {
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Reserva de Salas',
    pageStylesheet: 'bookings.css',
    pageScript: 'calendar.js',
    content: path.join(__dirname, '../views/pages/bookings')
  });
});

router.get('/confirm', (req, res) => {
  const sala = decodeURIComponent(req.query.sala || '');
  const data = decodeURIComponent(req.query.data || '');
  const hora = decodeURIComponent(req.query.hora || '');
  const descricao = decodeURIComponent(req.query.descricao || '');
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Confirmação de Reserva',
    content: path.join(__dirname, '../views/pages/confirm'),
    pageStylesheet: 'confirm.css',
    sala, 
    data,
    hora, 
    descricao,
    pageScript: null
  });
});

router.get('/cancel', (req, res) => {
  const { sala, data, hora, descricao } = req.query;
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Cancelar Reserva',
    content: path.join(__dirname, '../views/pages/cancel'),
    pageStylesheet: 'cancel.css',
    sala,
    data,
    hora,
    descricao,
    pageScript: null
  });
});

async function getRooms() {
  return [
    { id: 1, name: "Sala 1" },
    { id: 2, name: "Sala 2" },
    { id: 3, name: "Sala 3" },
    { id: 4, name: "Sala 4" }
  ];
}

router.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await getRooms();
    res.json(rooms);
  } catch (err) {
    console.error('Erro ao buscar salas:', err);
    res.status(500).json({ error: 'Erro ao buscar salas' });
  }
});

router.get('/api/bookings-by-date', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Data é obrigatória' });
    }
    const bookings = await Booking.getAllBookings();
    const filteredBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.date).toISOString().split('T')[0];
      return bookingDate === date;
    });
    const formattedBookings = filteredBookings.map(booking => {
      const formattedBooking = {...booking};
      if (typeof formattedBooking.start_time !== 'string') {
        if (formattedBooking.start_time instanceof Date) {
          formattedBooking.start_time = formattedBooking.start_time.toTimeString().substring(0, 5);
        } else {
          formattedBooking.start_time = String(formattedBooking.start_time);
        }
      }
      return formattedBooking;
    });
    res.json(formattedBookings);
  } catch (err) {
    console.error('Erro ao buscar reservas por data:', err);
    res.status(500).json({ error: 'Erro ao buscar reservas por data' });
  }
});

router.get('/api/available-rooms', async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date || !time) {
      return res.status(400).json({ error: 'Data e hora são obrigatórias' });
    }
    const allRooms = await getRooms();
    const bookings = await Booking.getAllBookings();
    const filteredBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.date).toISOString().split('T')[0];
      let bookingTime;
      if (typeof booking.start_time === 'string') {
        bookingTime = booking.start_time.substring(0, 5);
      } else if (booking.start_time instanceof Date) {
        bookingTime = booking.start_time.toTimeString().substring(0, 5);
      } else {
        bookingTime = String(booking.start_time);
      }
      return bookingDate === date && bookingTime === time;
    });
    const bookedRoomIds = new Set(filteredBookings.map(booking => booking.room_id));
    const availableRooms = allRooms.filter(room => !bookedRoomIds.has(room.id));
    res.json(availableRooms);
  } catch (err) {
    console.error('Erro ao buscar salas disponíveis:', err);
    res.status(500).json({ error: 'Erro ao buscar salas disponíveis' });
  }
});

router.post('/confirmar', async (req, res) => {
  try {
    const { sala, data, hora, descricao } = req.body;
    if (!sala || !data || !hora || !descricao) {
      return res.status(400).send('Dados incompletos para criar a reserva');
    }
    const userId = req.cookies.userId;
    if (!userId) {
      return res.redirect('/auth/login');
    }
    let formattedDate;
    if (data.includes('/')) {
      const parts = data.split('/');
      const day = parts[0];
      const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      let month;
      if (monthNames.includes(parts[1].toLowerCase())) {
        month = monthNames.indexOf(parts[1].toLowerCase()) + 1;
      } else {
        month = parseInt(parts[1]);
      }
      const year = new Date().getFullYear();
      formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else {
      formattedDate = data;
    }
    try {
      const newBooking = await Booking.createBooking({
        user_id: parseInt(userId),
        room_id: parseInt(sala),
        start_time: hora,
        status: 'ativa',
        date: formattedDate,
        description: descricao
      });
      res.redirect('/');
    } catch (err) {
      console.error('Erro específico ao criar reserva:', err);
      res.status(500).send(`Erro ao criar reserva: ${err.message}`);
    }
  } catch (err) {
    console.error('Erro ao criar reserva:', err);
    res.status(500).send('Erro ao criar reserva');
  }
});

router.get('/cancel/:id', async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const booking = await Booking.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).send('Reserva não encontrada');
    }
    const date = new Date(booking.date);
    const day = ('0' + date.getDate()).slice(-2);
    const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const month = monthNames[date.getMonth()];
    const formattedDate = `${day}/${month}`;
    let formattedTime;
    if (typeof booking.start_time === 'string') {
      if (booking.start_time.includes(':')) {
        const timeParts = booking.start_time.split(':');
        formattedTime = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
      } else {
        formattedTime = booking.start_time;
      }
    } else if (booking.start_time instanceof Date) {
      const hours = ('0' + booking.start_time.getHours()).slice(-2);
      const minutes = ('0' + booking.start_time.getMinutes()).slice(-2);
      formattedTime = `${hours}:${minutes}`;
    } else {
      formattedTime = String(booking.start_time);
    }
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: `Cancelar Sala ${booking.room_id}`,
      content: path.join(__dirname, '../views/pages/cancel'),
      pageStylesheet: 'cancel.css',
      sala: booking.room_id,
      data: formattedDate,
      hora: formattedTime,
      descricao: booking.description,
      id: booking.id,
      pageScript: null
    });
  } catch (err) {
    console.error('Erro ao buscar reserva:', err);
    res.status(500).send('Erro ao buscar reserva');
  }
});

router.post('/cancelar', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send('ID da reserva não fornecido');
    }
    const deletedBooking = await Booking.deleteBooking(parseInt(id));
    if (!deletedBooking) {
      return res.status(404).send('Reserva não encontrada');
    }
    res.redirect('/');
  } catch (err) {
    console.error('Erro ao cancelar reserva:', err);
    res.status(500).send('Erro ao cancelar reserva');
  }
});

module.exports = router;
