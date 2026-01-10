import request from 'supertest';
import app from '../app.js';
import { inicializarBanco, openDb } from '../config/db.js';
import bcrypt from 'bcrypt';

describe('Testes de Páginas (HTML)', () => {
    let cookieAdmin = null;

    beforeAll(async () => {
        await inicializarBanco();
        const db = await openDb();
        const hash = await bcrypt.hash('123456', 10);
        try {
            await db.run("INSERT INTO usuarios (login, senha) VALUES ($1, $2)", ['admin_pages', hash]);
        } catch (e) {}
    });

    it('Deve carregar a Home Page ( / )', async () => {
        const res = await request(app).get('/');
        expect([200, 304]).toContain(res.statusCode);
        expect(res.type).toBe('text/html');
    });

    it('Deve carregar a Página do Mapa ( /mapa )', async () => {
        const res = await request(app).get('/mapa');
        expect([200, 304]).toContain(res.statusCode);
        expect(res.type).toBe('text/html');
    });

    it('Admin deve conseguir acessar o Dashboard ( /admin )', async () => {
        const loginRes = await request(app)
            .post('/api/login')
            .send({ login: 'admin_pages', senha: '123456' });
        cookieAdmin = loginRes.headers['set-cookie'];

        const res = await request(app)
            .get('/admin') 
            .set('Cookie', cookieAdmin);

        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Painel Admin');
    });

    it('Visitante NÃO deve acessar o Dashboard', async () => {
        const res = await request(app).get('/admin');
        expect(res.statusCode).toBe(302);
        expect(res.header.location).toContain('/login');
    });
});