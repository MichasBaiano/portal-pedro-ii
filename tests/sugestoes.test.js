import request from 'supertest';
import app from '../app.js';
import { inicializarBanco } from '../config/db.js';

describe('Testes de Validação - Sugestões', () => {

    beforeAll(async () => {
        await inicializarBanco();
    });

    // 1. Caminho com tudo certo
    it('POST /api/sugestoes - Deve aceitar uma sugestão válida', async () => {
        const payload = {
            nome: "Tester da Silva",
            email: "teste@email.com",
            mensagem: "Adorei o site, parabéns!"
        };

        const res = await request(app)
            .post('/api/sugestoes')
            .send(payload);

        expect(res.statusCode).toEqual(201); // Created
        expect(res.body).toHaveProperty('id');
    });

    // 2. Caminho com Email inválido
    it('POST /api/sugestoes - Deve rejeitar email inválido', async () => {
        const payload = {
            nome: "Hacker",
            email: "email-todo-errado", // <--- ERRO AQUI
            mensagem: "Tentando quebrar"
        };

        const res = await request(app)
            .post('/api/sugestoes')
            .send(payload);

        // O express-validator geralmente retorna 400 ou 422 para erro de validação
        expect(res.statusCode).toBeGreaterThanOrEqual(400); 
        expect(res.body).toHaveProperty('detalhes'); // Seu middleware de erro deve retornar isso
        expect(res.body.detalhes[0].path).toBe('email'); // Verifica se o erro foi no campo email mesmo
    });

    // 3. Caminho com dados faltando
    it('POST /api/sugestoes - Deve rejeitar falta de mensagem', async () => {
        const payload = {
            nome: "Esquecido",
            email: "teste@email.com"
            // Faltou a mensagem!
        };

        const res = await request(app)
            .post('/api/sugestoes')
            .send(payload);

        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
});