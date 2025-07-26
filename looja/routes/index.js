const express = require('express');
const router = express.Router();
const db = require('../database');
const nodemailer = require('nodemailer');

router.get('/', (req, res) => {
  db.all("SELECT * FROM produtos WHERE categoria = 'croissant'", (err, rows) => {
    if (err) {
      console.error("Erro ao buscar croissants:", err);
      return res.status(500).send("Erro ao carregar os croissants");
    }
    res.render('index', { doces: rows });
  });
});

router.get('/doces2', (req, res) => {
  db.all("SELECT * FROM produtos WHERE categoria = 'donut'", (err, rows) => {
    if (err) {
      console.error("Erro ao buscar donuts:", err);
      return res.status(500).send("Erro ao carregar os donuts");
    }
    res.render('doces2', { doces: rows });
  });
});

router.get('/doces3', (req, res) => {
  db.all("SELECT * FROM produtos WHERE categoria = 'sonho'", (err, rows) => {
    if (err) {
      console.error("Erro ao buscar sonhos:", err);
      return res.status(500).send("Erro ao carregar os sonhos");
    }
    res.render('doces3', { doces: rows });
  });
});

router.get('/carrinho', (req, res) => {
  const carrinho = req.session.carrinho || [];
  const total = carrinho.reduce((sum, item) => sum + item.valor * item.quantidade, 0);
  res.render('carrinho', { carrinho, total, enviado: false });
});

router.post('/add-carrinho', (req, res) => {
  const { id, nome, valor, quantidade } = req.body;

  if (!req.session.carrinho) {
    req.session.carrinho = [];
  }

  const existente = req.session.carrinho.find(item => item.nome === nome);
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

router.post('/enviar-orcamento', (req, res) => {
  const { nome, email, itens, observ, total } = req.body;

  if (!nome || !email || !itens) {
    return res.status(400).send("Por favor, preencha todos os campos obrigatórios.");
  }

  let carrinho;
  try {
    carrinho = JSON.parse(itens);
  } catch (e) {
    return res.status(400).send("Itens inválidos.");
  }

  function enviarEmailOrcamento() {
    const corpoEmail = `
Novo pedido de orçamento:
Nome: ${nome}
Email do cliente: ${email}
Observações ou alergias: ${observ}

Itens:
${carrinho.map(i => `- ${i.nome} (x${i.quantidade}) - R$ ${(i.valor * i.quantidade).toFixed(2)}`).join('\n')}

Total: R$ ${parseFloat(total).toFixed(2)}
    `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ana.candido09@aluno.ifce.edu.br',
        pass: 'jvsgrvvqsevknvfa'
      }
    });

    const mailOptions = {
      from: 'ana.candido09@aluno.ifce.edu.br',
      to: 'ana.candido09@aluno.ifce.edu.br',
      subject: 'Novo orçamento de cliente - LS Pastry',
      text: corpoEmail
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erro ao enviar email:', error);
        return res.status(500).send('Erro ao enviar o orçamento.');
      }

      req.session.carrinho = [];

      res.render('carrinho', {
        carrinho: [],
        total: 0,
        enviado: true
      });
    });
  }

  const sqlCheckCliente = "SELECT id FROM clientes WHERE email = ?";
  db.get(sqlCheckCliente, [email], (err, row) => {
    if (err) {
      console.error("Erro ao buscar cliente:", err);
      return res.status(500).send("Erro no servidor.");
    }

    if (!row) {
      const sqlInsertCliente = "INSERT INTO clientes (nome, email) VALUES (?, ?)";
      db.run(sqlInsertCliente, [nome, email], (err2) => {
        if (err2) {
          console.error("Erro ao inserir cliente:", err2);
          return res.status(500).send("Erro ao salvar cliente.");
        }
        enviarEmailOrcamento();
      });
    } else {
      enviarEmailOrcamento();
    }
  });
});

router.post('/esvaziar-carrinho', (req, res) => {
  req.session.carrinho = [];
  res.redirect('/carrinho');
});

router.get('/debug/clientes', (req, res) => {
  db.all("SELECT * FROM clientes", (err, rows) => {
    if (err) {
      console.error("Erro ao buscar clientes:", err);
      return res.status(500).send("Erro ao buscar clientes");
    }
    console.log("Clientes no banco:", rows);
    res.send("Dados dos clientes foram logados no console do servidor.");
  });
});

router.get('/debug/produtos', (req, res) => {
  db.all("SELECT * FROM produtos", (err, rows) => {
    if (err) {
      console.error("Erro ao buscar produtos:", err);
      return res.status(500).send("Erro ao buscar produtos");
    }
    console.log("Produtos no banco:", rows);
    res.send("Dados dos produtos foram logados no console do servidor.");
  });
});


module.exports = router;
