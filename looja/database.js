const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.serialize(() => {
  // Cria tabela doces1
  db.run(`
    CREATE TABLE IF NOT EXISTS doces1 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      valor REAL,
      foto TEXT,
      texto TEXT
    )
  `);

  // Verifica e insere dados em doces1
  db.get("SELECT COUNT(*) AS total FROM doces1", (err, row) => {
    if (err) {
      console.error("Erro ao contar registros doces1:", err);
      return;
    }
    if (row.total === 0) {
      const docesIniciais1 = [
        ['Chocolate Belga com Granulado', 9.90, 'Donut1.png', 'Donut mergulhado em chocolate premium e granulado crocante.'],
        ['Clássico Glacê de Baunilha', 8.50, 'Donut2.png', 'Cobertura suave e leitosa, perfeito para quem ama o tradicional.'],
        ['Clássico Açucarado', 9.50, 'Donut3.png', 'Massa fofinha e suave de baunilha, coberto com açúcar mascavo.']
      ];
      const stmt1 = db.prepare("INSERT INTO doces1 (nome, valor, foto, texto) VALUES (?, ?, ?, ?)");
      docesIniciais1.forEach(doce => stmt1.run(doce));
      stmt1.finalize();
      console.log("Dados inseridos em doces1.");
    }
  });

  // Cria tabela doces2
  db.run(`
    CREATE TABLE IF NOT EXISTS doces2 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      valor REAL,
      foto TEXT,
      texto TEXT
    )
  `);

  // Verifica e insere dados em doces2
  db.get("SELECT COUNT(*) AS total FROM doces2", (err, row) => {
    if (err) {
      console.error("Erro ao contar registros doces2:", err);
      return;
    }
    if (row.total === 0) {
      const docesIniciais2 = [
        ['Framboesa e White Chocolate', 13.80, 'Croi1.png', 'Equilíbrio entre o azedinho da fruta e o doce do chocolate branco.'],
        ['Nutella e Banana', 14.50, 'Croi2.png', 'Combinação perfeita de avelã e fruta.'],
        ['Pistache granulado', 12.00, 'Croi3.png', 'Apenas para os exóticos.']
      ];
      const stmt2 = db.prepare("INSERT INTO doces2 (nome, valor, foto, texto) VALUES (?, ?, ?, ?)");
      docesIniciais2.forEach(doce => stmt2.run(doce));
      stmt2.finalize();
      console.log("Dados inseridos em doces2.");
    }
  });

 // Cria tabela doces3
  db.run(`
    CREATE TABLE IF NOT EXISTS doces3 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      valor REAL,
      foto TEXT,
      texto TEXT
    )
  `);

  // Verifica e insere dados em doces3
  db.get("SELECT COUNT(*) AS total FROM doces3", (err, row) => {
    if (err) {
      console.error("Erro ao contar registros doces3:", err);
      return;
    }
    if (row.total === 0) {
      const docesIniciais3 = [
        ['Chocolate 70% Cacau', 8.90, 'Sonho1.png', 'Para os amantes de chocolate intenso.'],
        ['Creme Branco', 7.50, 'Sonho2.png', 'Recheio delicado com toque de baunilha.'],
        ['Doce de Leite', 8.60, 'Sonho3.png', 'Recheio cremoso e levemente caramelizado.']
      ];
      const stmt3 = db.prepare("INSERT INTO doces3 (nome, valor, foto, texto) VALUES (?, ?, ?, ?)");
      docesIniciais3.forEach(doce => stmt3.run(doce));
      stmt3.finalize();
      console.log("Dados inseridos em doces3.");
    }
  });

});

module.exports = db;
