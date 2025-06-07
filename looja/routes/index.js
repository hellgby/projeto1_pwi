var express = require('express');
var router = express.Router();

/* Rota principal */
router.get('/', function(req, res) {
  res.render('index', { title: 'Loja de Doces' });
});

/* Suas rotas de doces */
router.get('/doces1', function(req, res) {
  res.render('doces1');
});

router.get('/doces2', function(req, res) {
  res.render('doces2');
});

router.get('/doces3', function(req, res) {
  res.render('doces3');
});

router.get('/info1', function(req, res) {
  res.send('Informações sobre Doces 1');
});

module.exports = router;
