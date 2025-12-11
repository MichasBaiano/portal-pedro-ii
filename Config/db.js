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

    // --- 3. TABELA EVENTOS (NOVO) ---
    await db.exec(`
        CREATE TABLE IF NOT EXISTS eventos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            data TEXT,
            local TEXT,
            categoria TEXT,
            descricao TEXT,
            imagem TEXT
        )
    `);

    // Seed Eventos
    const qtdEventos = await db.get("SELECT count(*) as count FROM eventos");
    if (qtdEventos.count === 0) {
        await db.exec(`
            INSERT INTO eventos (nome, data, local, categoria, descricao, imagem) VALUES 
            ('Festival de Inverno', '2025-06-20', 'Praça da Bonelle', 'Música', 'O maior evento de jazz e blues.', 'https://via.placeholder.com/400x200'),
            ('Feira da Opala', '2025-07-15', 'Mercado', 'Feira', 'Exposição de joias.', 'https://via.placeholder.com/400x200')
        `);
    }

    // --- 4. TABELA ESTABELECIMENTOS (NOVO) ---
    await db.exec(`
        CREATE TABLE IF NOT EXISTS estabelecimentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            categoria TEXT,
            endereco TEXT,
            telefone TEXT,
            descricao TEXT,
            imagem TEXT,
            destaque INTEGER
        )
    `);

    // Seed Estabelecimentos (Note: destaque 1 = true, 0 = false)
    const qtdEst = await db.get("SELECT count(*) as count FROM estabelecimentos");
    if (qtdEst.count === 0) {
        await db.exec(`
            INSERT INTO estabelecimentos (nome, categoria, endereco, telefone, descricao, imagem, destaque) VALUES 
            ('Pousada do Norte', 'hospedagem', 'Rua A, 123', '(86) 9999-0000', 'Conforto no centro.', 'https://via.placeholder.com/400x300', 1),
            ('Restaurante Sabor', 'gastronomia', 'Av. B, 456', '(86) 9888-1111', 'Comida típica.', 'https://via.placeholder.com/400x300', 0)
        `);
    }

    console.log("Banco de dados atualizado com sucesso!");
}