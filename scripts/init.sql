CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
);

CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  available BOOLEAN DEFAULT TRUE,
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  room_id INT NOT NULL REFERENCES rooms(id),
  start_time VARCHAR(5) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('ativa', 'cancelada', 'concluída')),
  date DATE NOT NULL,
  description TEXT NOT NULL
);
