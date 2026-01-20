import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Verifica se estamos conectando no Render (pela URL)
const connectionString = process.env.DATABASE_URL;
const isRender = connectionString && connectionString.includes('render.com');

// Define se precisa de SSL (Produção OU Render Remoto)
const useSSL = process.env.NODE_ENV === 'production' || isRender;

const pool = new pg.Pool({
    connectionString: connectionString,
    // Se for Render ou Produção, OBRIGA o uso de SSL com rejectUnauthorized false (padrão para heroku/render)
    ssl: useSSL ? { rejectUnauthorized: false } : false
});

export const openDb = async () => {
    return {
        all: async (text, params) => {
            const res = await pool.query(text, params);
            return res.rows;
        },
        get: async (text, params) => {
            const res = await pool.query(text, params);
            return res.rows[0];
        },
        run: async (text, params) => {
            const res = await pool.query(text, params);
            return { 
                lastID: res.rows[0]?.id, 
                changes: res.rowCount 
            };
        },
        exec: async (text) => {
            return await pool.query(text);
        }
    };
};

export const inicializarBanco = async () => {
    const db = await openDb();
    
    console.log("Reiniciando tabelas do banco PostgreSQL...");

    

    await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            login TEXT UNIQUE,
            senha TEXT
        );

        CREATE TABLE IF NOT EXISTS eventos (
            id SERIAL PRIMARY KEY,
            nome TEXT,
            data TIMESTAMP,
            local TEXT,
            categoria TEXT,
            descricao TEXT,
            imagem TEXT
        );
        
        CREATE TABLE IF NOT EXISTS estabelecimentos (
            id SERIAL PRIMARY KEY,
            nome TEXT,
            categoria TEXT,
            endereco TEXT,
            telefone TEXT,
            descricao TEXT,
            imagem TEXT,
            latitude TEXT,
            longitude TEXT,
            destaque INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS sugestoes (
            id SERIAL PRIMARY KEY,
            tipo TEXT,
            nome TEXT,
            email TEXT,
            mensagem TEXT,
            status TEXT DEFAULT 'pendente'
        );

        CREATE TABLE IF NOT EXISTS transportes (
            id SERIAL PRIMARY KEY,
            tipo TEXT,
            nome TEXT,
            rota TEXT,
            horarios TEXT,
            contato TEXT,
            icone TEXT
        );

        CREATE TABLE IF NOT EXISTS banners (
            id SERIAL PRIMARY KEY,
            titulo TEXT,
            imagem TEXT,
            link TEXT,
            ordem INTEGER,
            ativo INTEGER DEFAULT 1
        );
        
        CREATE TABLE IF NOT EXISTS avaliacoes (
            id SERIAL PRIMARY KEY,
            item_id INTEGER,
            tipo TEXT,
            nota INTEGER,
            comentario TEXT,
            autor TEXT,
            data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    
    console.log("Banco de dados PostgreSQL recriado com sucesso!");
};