import request from 'supertest';
import app from '../app.js';
import { inicializarBanco } from '../config/db.js';

describe('Testes da API de Estabelecimentos', () => {

    beforeAll(async () => {
        await inicializarBanco();
    });

    it('GET /api/estabelecimentos - Deve retornar dados e meta de paginação', async () => {
        const res = await request(app).get('/api/estabelecimentos');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('dados');
        expect(res.body).toHaveProperty('meta');
        expect(res.body.meta).toHaveProperty('totalPaginas');
    });

    it('GET /api/estabelecimentos?q=inexistente - Busca vazia não deve quebrar', async () => {
        const res = await request(app).get('/api/estabelecimentos?q=algoqueNaoExiste123');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.dados).toEqual([]); // Array vazio
        expect(res.body.meta.totalItens).toEqual(0);
    });
});