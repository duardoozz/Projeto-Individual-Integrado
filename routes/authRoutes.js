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

// Processar o login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verificar se o email e senha foram fornecidos
    if (!email || !password) {
      return res.status(400).send('Email e senha são obrigatórios');
    }
    
    // Buscar o usuário pelo email
    const users = await userModel.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).send('Email ou senha incorretos');
    }
    
    // Em uma aplicação real, você usaria sessões ou JWT aqui
    // Por simplicidade, vamos armazenar o ID do usuário em um cookie
    res.cookie('userId', user.id, { httpOnly: true });
    
    // Redirecionar para a página inicial (page1)
    res.redirect('/');
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).send('Erro ao fazer login');
  }
});

// Processar o cadastro
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    // Verificar se todos os campos foram preenchidos
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).send('Todos os campos são obrigatórios');
    }
    
    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      return res.status(400).send('As senhas não coincidem');
    }
    
    // Verificar se o email já está em uso
    const users = await userModel.getAllUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      return res.status(400).send('Este email já está em uso');
    }
    
    // Criar o novo usuário
    const newUser = await userModel.createUser({ name, email, password });
    
    // Redirecionar para a página de login
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Erro ao criar conta:', err);
    res.status(500).send('Erro ao criar conta');
  }
});

module.exports = router;


