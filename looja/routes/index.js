const express = require('express');
const router = express.Router();
const db = require('../database');
const nodemailer = require('nodemailer');

// Rota para página inicial (Croissants)
router.get('/', (req, res) => {
  db.all("SELECT * FROM doces1", (err, rows) => {
    if (err) {
      console.error("Erro ao buscar doces:", err);
      return res.status(500).send("Erro ao carregar os doces");
    }
    res.render('index', { doces: rows });
  });
});

// Rota para página doces2 (Donuts)
router.get('/doces2', (req, res) => {
  db.all("SELECT * FROM doces2", (err, rows) => {
    if (err) {
      console.error("Erro ao buscar doces:", err);
      return res.status(500).send("Erro ao carregar os doces");
    }
    res.render('doces2', { doces: rows });
  });
});

// Rota para página doces3 (Sonhos)
router.get('/doces3', (req, res) => {
  db.all("SELECT * FROM doces3", (err, rows) => {
    if (err) {
      console.error("Erro ao buscar doces:", err);
      return res.status(500).send("Erro ao carregar os doces");
    }
    res.render('doces3', { doces: rows });
  });
});

// Rota para exibir o carrinho
router.get('/carrinho', (req, res) => {
  const carrinho = req.session.carrinho || [];
  const total = carrinho.reduce((sum, item) => sum + item.valor * item.quantidade, 0);
  res.render('carrinho', { carrinho, total, enviado: false });
});

// Rota para adicionar item ao carrinho via POST
router.post('/add-carrinho', (req, res) => {
  const { id, nome, valor, quantidade } = req.body;

  if (!req.session.carrinho) {
    req.session.carrinho = [];
  }

  // Agora compara id E nome para diferenciar doces com ids iguais mas nomes diferentes
const existente = req.session.carrinho.find(item => item.nome == nome);
  if (existente) {
    existente.quantidade += parseInt(quantidade);
  } else {
    req.session.carrinho.push({
      id,
      nome,
      valor: parseFloat(valor),
      quantidade: parseInt(quantidade)
    });
  }

  res.redirect('back');
});


// Rota para enviar orçamento por e-mail
router.post('/enviar-orcamento', (req, res) => {
  const { nome, email, itens, total } = req.body;

  if (!nome || !email || !itens) {
    return res.status(400).send("Por favor, preencha todos os campos obrigatórios.");
  }

  let carrinho;
  try {
    carrinho = JSON.parse(itens);
  } catch (e) {
    return res.status(400).send("Itens inválidos.");
  }

  const corpoEmail = `
Novo pedido de orçamento:
Nome: ${nome}
Email do cliente: ${email}

Itens:
${carrinho.map(i => `- ${i.nome} (x${i.quantidade}) - R$ ${(i.valor * i.quantidade).toFixed(2)}`).join('\n')}

Total: R$ ${parseFloat(total).toFixed(2)}
  `;

  // Configura o transporter com seu e-mail e senha de app
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ana.candido09@aluno.ifce.edu.br',   // seu e-mail
      pass: 'jvsgrvvqsevknvfa'                    // sua senha de app (sem espaços)
    }
  });

  const mailOptions = {
    from: 'ana.candido09@aluno.ifce.edu.br',     // sempre seu e-mail aqui
    to: 'ana.candido09@aluno.ifce.edu.br',       // para você mesma
    subject: 'Novo orçamento de cliente - LS Pastry',
    text: corpoEmail
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar email:', error);
      return res.status(500).send('Erro ao enviar o orçamento.');
    }

    // Limpa o carrinho após envio
    req.session.carrinho = [];

    // Renderiza a página do carrinho com mensagem de sucesso
    res.render('carrinho', {
      carrinho: [],
      total: 0,
      enviado: true
    });
  });
});

router.post('/esvaziar-carrinho', (req, res) => {
  console.log("Antes de zerar:", req.session.carrinho);
  req.session.carrinho = [];
  console.log("Depois de zerar:", req.session.carrinho);
  res.redirect('/carrinho');
});




module.exports = router;
