const express = require('express');
const router = express.Router();
const path = require('path');
const Booking = require('../models/bookingModel');
const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.get('/', async (req, res) => {
  try {
    // Obter o ID do usuário do cookie
    const userId = req.cookies.userId;
    
    if (!userId) {
      // Se não estiver logado, redirecionar para a página de login
      return res.redirect('/auth/login');
    }
    
    // Buscar apenas as reservas do usuário logado usando o novo método
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
  const { sala, data, hora, descricao } = req.query;
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Confirmação de Reserva',
    content: path.join(__dirname, '../views/pages/confirm'),
    pageStylesheet: 'confirm.css',
    sala, data, hora, descricao,
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

// Função auxiliar para obter todas as salas
async function getRooms() {
  // Simulação de salas - em um ambiente real, isso viria do banco de dados
  return [
    { id: 1, name: "Sala 1" },
    { id: 2, name: "Sala 2" },
    { id: 3, name: "Sala 3" },
    { id: 4, name: "Sala 4" }
  ];
}

// Rota para obter todas as salas
router.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await getRooms();
    res.json(rooms);
  } catch (err) {
    console.error('Erro ao buscar salas:', err);
    res.status(500).json({ error: 'Erro ao buscar salas' });
  }
});

// Rota para obter reservas por data
router.get('/api/bookings-by-date', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Data é obrigatória' });
    }
    
    // Buscar todas as reservas para a data especificada
    const bookings = await Booking.getAllBookings();
    const filteredBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.date).toISOString().split('T')[0];
      return bookingDate === date;
    });
    
    // Garantir que start_time seja uma string para o cliente
    const formattedBookings = filteredBookings.map(booking => {
      const formattedBooking = {...booking};
      
      // Verificar e formatar start_time
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

// Rota para obter salas disponíveis para uma data e horário específicos
router.get('/api/available-rooms', async (req, res) => {
  try {
    const { date, time } = req.query;
    
    if (!date || !time) {
      return res.status(400).json({ error: 'Data e hora são obrigatórias' });
    }
    
    // Buscar todas as salas
    const allRooms = await getRooms();
    
    // Buscar todas as reservas para a data e hora especificadas
    const bookings = await Booking.getAllBookings();
    const filteredBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.date).toISOString().split('T')[0];
      
      // Verificar se start_time é uma string antes de chamar substring
      let bookingTime;
      if (typeof booking.start_time === 'string') {
        bookingTime = booking.start_time.substring(0, 5); // Pegar apenas HH:MM
      } else if (booking.start_time instanceof Date) {
        // Se for um objeto Date, formatar para HH:MM
        bookingTime = booking.start_time.toTimeString().substring(0, 5);
      } else {
        // Se não for string nem Date, converter para string
        bookingTime = String(booking.start_time);
      }
      
      return bookingDate === date && bookingTime === time;
    });
    
    // Criar um conjunto de IDs de salas já reservadas
    const bookedRoomIds = new Set(filteredBookings.map(booking => booking.room_id));
    
    // Filtrar apenas as salas disponíveis
    const availableRooms = allRooms.filter(room => !bookedRoomIds.has(room.id));
    
    res.json(availableRooms);
  } catch (err) {
    console.error('Erro ao buscar salas disponíveis:', err);
    res.status(500).json({ error: 'Erro ao buscar salas disponíveis' });
  }
});

// Adicionar rota para processar a confirmação da reserva
router.post('/confirmar', async (req, res) => {
  try {
    console.log('Dados recebidos no formulário:', req.body);
    
    const { sala, data, hora, descricao } = req.body;
    
    // Verificar se todos os dados necessários estão presentes
    if (!sala || !data || !hora || !descricao) {
      console.error('Dados incompletos:', { sala, data, hora, descricao });
      return res.status(400).send('Dados incompletos para criar a reserva');
    }
    
    // Obter o ID do usuário do cookie
    const userId = req.cookies.userId;
    
    if (!userId) {
      // Se não estiver logado, redirecionar para a página de login
      return res.redirect('/auth/login');
    }
    
    // Formatar a data para o formato do banco de dados (YYYY-MM-DD)
    let formattedDate;
    if (data.includes('/')) {
      // Se a data estiver no formato DD/MM ou DD/MMM
      const parts = data.split('/');
      const day = parts[0];
      const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      let month;
      
      if (monthNames.includes(parts[1].toLowerCase())) {
        // Se o mês estiver como abreviação (jan, fev, etc.)
        month = monthNames.indexOf(parts[1].toLowerCase()) + 1;
      } else {
        // Se o mês estiver como número
        month = parseInt(parts[1]);
      }
      
      const year = new Date().getFullYear();
      formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else {
      // Se a data já estiver em outro formato, manter como está
      formattedDate = data;
    }
    
    // Criar a reserva no banco de dados
    try {
      const newBooking = await Booking.createBooking({
        user_id: parseInt(userId), // Usar o ID do usuário logado
        room_id: parseInt(sala),
        start_time: hora, // Passar o horário como está
        status: 'ativa',
        date: formattedDate,
        description: descricao
      });
      
      console.log('Reserva criada com sucesso:', newBooking);
      
      // Redirecionar para a página inicial com as reservas atualizadas
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

// Rota para acessar a página de cancelamento de uma reserva específica
router.get('/cancel/:id', async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    
    // Buscar a reserva pelo ID
    const booking = await Booking.getBookingById(bookingId);
    
    if (!booking) {
      return res.status(404).send('Reserva não encontrada');
    }
    
    // Formatar a data para exibição (DD/MMM)
    const date = new Date(booking.date);
    const day = ('0' + date.getDate()).slice(-2);
    const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const month = monthNames[date.getMonth()];
    const formattedDate = `${day}/${month}`;
    
    // Formatar a hora para exibição (HH:MM)
    let formattedTime;
    if (typeof booking.start_time === 'string') {
      // Se já for uma string, garantir que esteja no formato HH:MM
      if (booking.start_time.includes(':')) {
        // Extrair apenas HH:MM se for uma string mais longa
        const timeParts = booking.start_time.split(':');
        formattedTime = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
      } else {
        formattedTime = booking.start_time;
      }
    } else if (booking.start_time instanceof Date) {
      // Se for um objeto Date, formatar para HH:MM
      const hours = ('0' + booking.start_time.getHours()).slice(-2);
      const minutes = ('0' + booking.start_time.getMinutes()).slice(-2);
      formattedTime = `${hours}:${minutes}`;
    } else {
      // Se não for string nem Date, converter para string
      formattedTime = String(booking.start_time);
    }
    
    // Renderizar a página de cancelamento com os dados da reserva
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: `Cancelar Sala ${booking.room_id}`,
      content: path.join(__dirname, '../views/pages/cancel'),
      pageStylesheet: 'cancel.css',
      sala: booking.room_id,
      data: formattedDate,
      hora: formattedTime,
      descricao: booking.description,
      id: booking.id, // Passar o ID da reserva para o formulário
      pageScript: null
    });
  } catch (err) {
    console.error('Erro ao buscar reserva:', err);
    res.status(500).send('Erro ao buscar reserva');
  }
});

// Rota para processar o cancelamento da reserva
router.post('/cancelar', async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).send('ID da reserva não fornecido');
    }
    
    // Deletar a reserva do banco de dados
    const deletedBooking = await Booking.deleteBooking(parseInt(id));
    
    if (!deletedBooking) {
      return res.status(404).send('Reserva não encontrada');
    }
    
    // Redirecionar para a página inicial após o cancelamento
    res.redirect('/');
  } catch (err) {
    console.error('Erro ao cancelar reserva:', err);
    res.status(500).send('Erro ao cancelar reserva');
  }
});

module.exports = router;
