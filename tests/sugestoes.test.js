import request from 'supertest';
import app from '../app.js';
import { inicializarBanco, openDb } from '../config/db.js';
import bcrypt from 'bcrypt';

describe('API - Sugestões (Fale Conosco) - Completo', () => {
    let cookieAdmin = null;
    let idSugestao = 0;

    beforeAll(async () => {
        await inicializarBanco();
        const db = await openDb();
        
        // Cria um admin temporário para testar as rotas protegidas
        const hash = await bcrypt.hash('123456', 10);
        try {
            await db.run("INSERT INTO usuarios (login, senha) VALUES (?, ?)", ['admin_sugestao_coverage', hash]);
        } catch (e) {} // Se já existir, ignora
    });

    // --- PÚBLICO ---

    it('Qualquer um deve poder enviar uma sugestão válida', async () => {
        const payload = {
            nome: "Tester da Silva",
            email: "teste@email.com",
            mensagem: "Adorei o site, parabéns!",
            tipo: "elogio"
        };

        const res = await request(app)
            .post('/api/sugestoes')
            .send(payload);

        expect([200, 201]).toContain(res.statusCode);
        if (res.body.id) idSugestao = res.body.id;
    });

    it('Deve rejeitar email inválido (Validação)', async () => {
        const payload = {
            nome: "Hacker",
            email: "email-todo-errado",
            mensagem: "Tentando quebrar"
        };

        const res = await request(app)
            .post('/api/sugestoes')
            .send(payload);

        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    // --- ADMIN ---

    it('Deve fazer login como Admin', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ login: 'admin_sugestao_coverage', senha: '123456' });
        
        cookieAdmin = res.headers['set-cookie'];
        expect(res.statusCode).toEqual(200);
    });

    it('Admin deve conseguir LISTAR as sugestões', async () => {
        const res = await request(app)
            .get('/api/sugestoes')
            .set('Cookie', cookieAdmin); // Envia o cookie

        expect(res.statusCode).toEqual(200);
        
        // Verifica se veio alguma coisa
        const lista = Array.isArray(res.body) ? res.body : (res.body.dados || res.body.lista);
        expect(lista.length).toBeGreaterThan(0);
    });

    it('Admin deve conseguir DELETAR a sugestão criada', async () => {
        // Se não salvamos o ID lá em cima, tenta pegar da lista agora
        if (!idSugestao) {
            const listRes = await request(app).get('/api/sugestoes').set('Cookie', cookieAdmin);
            const lista = Array.isArray(listRes.body) ? listRes.body : (listRes.body.dados || listRes.body.lista);
            idSugestao = lista[0].id;
        }

        const res = await request(app)
            .delete(`/api/sugestoes/${idSugestao}`)
            .set('Cookie', cookieAdmin);

        expect(res.statusCode).toEqual(200);
    });
});