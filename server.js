require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');
const path = require('path');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

db.connect()
  .then(() => {
    console.log('Conectado ao banco de dados PostgreSQL');

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(express.static(path.join(__dirname, 'public')));

    const authRoutes = require('./routes/authRoutes');
    app.use('/auth', authRoutes);

    const userRoutes = require('./routes/userRoutes');
    app.use('/users', userRoutes);

    const frontendRoutes = require('./routes/frontRoutes');
    app.use('/', frontendRoutes);

    const roomRoutes = require('./routes/roomRoutes');
    app.use('/rooms', roomRoutes);

    const bookingRoutes = require('./routes/bookingRoutes');
    app.use('/bookings', bookingRoutes);

    app.get('/', (req, res) => {
      res.redirect('/auth/login');
    });

    app.use((req, res, next) => {
      res.status(404).send('Página não encontrada');
    });

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Erro no servidor');
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
.catch(err => {
  console.error('Erro ao conectar ao banco de dados:', err);
});
