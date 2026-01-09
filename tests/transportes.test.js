import request from 'supertest';
import app from '../app.js';
import { inicializarBanco } from '../config/db.js';

describe('Testes da API de Transportes', () => {

    beforeAll(async () => {
        await inicializarBanco();
    });

    it('GET /api/transportes - Deve retornar lista paginada', async () => {
        const res = await request(app).get('/api/transportes');

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.dados)).toBe(true);
        expect(res.body.meta.itensPorPagina).toBeGreaterThan(0);
    });
});