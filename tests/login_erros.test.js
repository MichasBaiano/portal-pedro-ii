import request from 'supertest';
import app from '../app.js';
import { inicializarBanco, openDb } from '../config/db.js';
import bcrypt from 'bcrypt';

describe('Testes de Autenticação - Cenários de Erro e Logout', () => {

    beforeAll(async () => {
        await inicializarBanco();
        const db = await openDb();
        const hash = await bcrypt.hash('senha_certa', 10);
        try {
            await db.run("INSERT INTO usuarios (login, senha) VALUES (?, ?)", ['usuario_teste_erro', hash]);
        } catch (e) {}
    });

    it('Deve rejeitar login com SENHA ERRADA', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ login: 'usuario_teste_erro', senha: 'senha_errada' });

        expect(res.statusCode).toBe(401);
        expect(res.body.sucesso).toBe(false);
    });

    it('Deve rejeitar login com USUÁRIO INEXISTENTE', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ login: 'fantasma', senha: 'qualquer_senha' });

        expect(res.statusCode).toBe(401);
        expect(res.body.sucesso).toBe(false);
    });

    it('Deve realizar LOGOUT com sucesso', async () => {
        // Primeiro loga para ter sessão
        const loginRes = await request(app)
            .post('/api/login')
            .send({ login: 'usuario_teste_erro', senha: 'senha_certa' });
        
        const cookies = loginRes.headers['set-cookie'];

        // Tenta sair
        const logoutRes = await request(app)
            .get('/api/logout') // ou POST, dependendo da sua rota
            .set('Cookie', cookies);

        // Geralmente redireciona (302) ou retorna 200
        expect([200, 302]).toContain(logoutRes.statusCode);
    });
});