const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Página Inicial',
    content: path.join(__dirname, '../views/pages/page1'),
    pageStylesheet: null,
    pageScript: null
  });
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

module.exports = router;