-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'user'))
);

-- Criar tabela de salas
CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  capacity INT NOT NULL,
  location VARCHAR(100) NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  availability_start TIME NOT NULL,
  availability_end TIME NOT NULL,
  created_by INT NOT NULL REFERENCES users(id)
);

-- Criar tabela de reservas
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  room_id INT NOT NULL REFERENCES rooms(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('ativa', 'cancelada', 'concluída')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  was_read BOOLEAN DEFAULT FALSE
);
