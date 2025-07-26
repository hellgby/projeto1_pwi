const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.serialize(() => {

  db.run(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL
  )
`);

  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      valor REAL,
      foto TEXT,
      texto TEXT,
      categoria TEXT
    )
  `);

  db.get("SELECT COUNT(*) AS total FROM produtos", (err, row) => {
    if (err) {
      console.error("Erro ao contar registros:", err);
      return;
    }

    if (row.total === 0) {
      const produtosIniciais = [
        // Donuts
        ['Chocolate Belga com Granulado', 9.90, 'Donut1.png', 'Donut mergulhado em chocolate premium e granulado crocante.', 'donut'],
        ['Clássico Glacê de Baunilha', 8.50, 'Donut2.png', 'Cobertura suave e leitosa, perfeito para quem ama o tradicional.', 'donut'],
        ['Clássico Açucarado', 9.50, 'Donut3.png', 'Massa fofinha e suave de baunilha, coberto com açúcar mascavo.', 'donut'],

        // Croissants
        ['Framboesa e White Chocolate', 13.80, 'Croi1.png', 'Equilíbrio frutado com cacau.', 'croissant'],
        ['Nutella e Banana', 14.50, 'Croi2.png', 'Combinação perfeita de avelã e fruta.', 'croissant'],
        ['Pistache granulado', 12.00, 'Croi3.png', 'Apenas para os exóticos.', 'croissant'],

        // Sonhos
        ['Chocolate 70% Cacau', 8.90, 'Sonho1.png', 'Para os amantes de chocolate intenso.', 'sonho'],
        ['Creme Branco', 7.50, 'Sonho2.png', 'Recheio delicado com toque de baunilha.', 'sonho'],
        ['Doce de Leite', 8.60, 'Sonho3.png', 'Recheio cremoso e levemente caramelizado.', 'sonho']
      ];

      const stmt = db.prepare("INSERT INTO produtos (nome, valor, foto, texto, categoria) VALUES (?, ?, ?, ?, ?)");
      produtosIniciais.forEach(prod => stmt.run(prod));
      stmt.finalize();
      console.log("Dados inseridos na tabela produtos.");
    }
  });
});

module.exports = db;
