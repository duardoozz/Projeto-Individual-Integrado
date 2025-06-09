const express = require('express');
const router = express.Router();
const path = require('path');
const userModel = require('../models/userModel');

// Rota para a página de login
router.get('/login', (req, res) => {
  console.log('Acessando rota de login');
  res.render('layout/main', {
    pageTitle: 'Login - SALAFLUX',
    pageStylesheet: 'auth.css',
    content: '../pages/login',
    pageScript: null
  });
});

// Rota para a página de cadastro
router.get('/signup', (req, res) => {
  console.log('Acessando rota de cadastro');
  res.render('layout/main', {
    pageTitle: 'Criar Conta - SALAFLUX',
    pageStylesheet: 'auth.css',
    content: '../pages/signup',
    pageScript: null
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).send('Email e senha são obrigatórios');
    }
    
    const users = await userModel.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).send('Email ou senha incorretos');
    }
    
    res.cookie('userId', user.id, { httpOnly: true });
    
    res.redirect('/');
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).send('Erro ao fazer login');
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).send('Todos os campos são obrigatórios');
    }
    
    if (password !== confirmPassword) {
      return res.status(400).send('As senhas não coincidem');
    }
    
    const users = await userModel.getAllUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      return res.status(400).send('Este email já está em uso');
    }
    
    const newUser = await userModel.createUser({ name, email, password });
    
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Erro ao criar conta:', err);
    res.status(500).send('Erro ao criar conta');
  }
});

module.exports = router;


