import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Função para abrir a conexão com o banco
export async function openDb() {
  return open({
    filename: './database.sqlite', // O arquivo será criado na raiz
    driver: sqlite3.Database
  });
}

export async function inicializarBanco() {
    const db = await openDb();

    // --- 1. TABELA SUGESTÕES ---
    await db.exec(`
        CREATE TABLE IF NOT EXISTS sugestoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT,
            nome TEXT,
            email TEXT,
            mensagem TEXT
        )
    `);

    // --- 2. TABELA TRANSPORTES ---
    await db.exec(`
        CREATE TABLE IF NOT EXISTS transportes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT,
            nome TEXT,
            rota TEXT,
            horarios TEXT,
            contato TEXT,
            icone TEXT
        )
    `);
    
    // Seed Transportes (Só insere se estiver vazio)
    const qtdTransp = await db.get("SELECT count(*) as count FROM transportes");
    if (qtdTransp.count === 0) {
        await db.exec(`
            INSERT INTO transportes (tipo, nome, rota, horarios, contato, icone) VALUES 
            ('onibus', 'Empresa Barroso', 'Teresina ↔ Pedro II', '07:00, 14:00', '(86) 3222-0000', '🚌'),
            ('mototaxi', 'Moto Central', 'Cidade', '06:00 às 22:00', '(86) 99999-1234', '🏍️')
        `);
    }

    // --- 3. TABELA EVENTOS ---
    await db.exec(`
        CREATE TABLE IF NOT EXISTS eventos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            data TEXT,
            local TEXT,
            categoria TEXT,
            descricao TEXT,
            imagem TEXT,
            latitude REAL,
            longitude REAL
        )
    `);

    // Seed Eventos
    const qtdEventos = await db.get("SELECT count(*) as count FROM eventos");
    if (qtdEventos.count === 0) {
        await db.run(`
            INSERT INTO eventos (nome, data, local, categoria, descricao, imagem, latitude, longitude) VALUES 
            ('Festival de Inverno', '2025-06-20', 'Praça da Bonelle', 'Música', 'O maior festival de jazz.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Morro_do_Gritador.jpg/800px-Morro_do_Gritador.jpg', -4.4255, -41.4586),
            ('Feira da Opala', '2025-07-15', 'Mercado do Artesão', 'Feira', 'Exposição de joias.', 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Opala_Pedro_II.jpg', -4.4240, -41.4590)
        `);
    }

    // --- 4. TABELA ESTABELECIMENTOS ---
    await db.exec(`
        CREATE TABLE IF NOT EXISTS estabelecimentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            categoria TEXT,
            endereco TEXT,
            telefone TEXT,
            descricao TEXT,
            imagem TEXT,
            destaque INTEGER,
            latitude REAL,
            longitude REAL
        )
    `);

    // Seed Estabelecimentos
    const qtdEst = await db.get("SELECT count(*) as count FROM estabelecimentos");
    if (qtdEst.count === 0) {
        await db.run(`
            INSERT INTO estabelecimentos (nome, categoria, endereco, telefone, descricao, imagem, destaque, latitude, longitude) VALUES 
            ('Pousada do Norte', 'hospedagem', 'Centro Histórico', '(86) 9999-0000', 'Conforto no centro.', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/64/73/0c/fachada.jpg?w=700&h=-1&s=1', 1, -4.4260, -41.4575),
            ('Mirante do Gritador', 'turismo', 'Serra dos Matões', '(86) 0000-0000', 'Vista panorâmica.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Morro_do_Gritador.jpg/800px-Morro_do_Gritador.jpg', 1, -4.3800, -41.4000)
        `);
    }

    // 5. NOVA TABELA: USUÁRIOS
    await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            login TEXT UNIQUE,
            senha TEXT
        )
    `);

    // 6. SEED ADMIN (Cria o admin se não existir)
    const adminExiste = await db.get("SELECT * FROM usuarios WHERE login = ?", ['admin']);
    if (!adminExiste) {
        // ATENÇÃO: Em produção, nunca salve senhas em texto puro. Usaremos assim apenas para o MVP didático.
        await db.run("INSERT INTO usuarios (login, senha) VALUES (?, ?)", ['admin', '123456']);
        console.log("Usuário ADMIN criado: login 'admin', senha '123456'");
    }

    // --- 7. TABELA BANNERS (NOVO) ---
    await db.exec(`
        CREATE TABLE IF NOT EXISTS banners (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT,
            imagem TEXT,
            link TEXT
        )
    `);

    console.log("Banco de dados atualizado com sucesso!");
}