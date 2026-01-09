import request from 'supertest';
import app from '../app.js'; // Importa a lógica do site
import { inicializarBanco } from '../config/db.js';

describe('Testes da API de Eventos', () => {
    
    // Antes de tudo, garante que o banco de memória existe e tem as tabelas
    beforeAll(async () => {
        await inicializarBanco();
    });

    it('GET /api/eventos - Deve retornar lista de eventos e paginação', async () => {
        // Simula uma requisição GET na rota
        const res = await request(app).get('/api/eventos');

        // Verificações (Expectativas)
        expect(res.statusCode).toEqual(200); // Tem que dar OK
        expect(res.body).toHaveProperty('dados'); // Tem que ter o array de dados
        expect(res.body).toHaveProperty('meta'); // Tem que ter os metadados
        expect(Array.isArray(res.body.dados)).toBe(true); // Dados tem que ser um array
    });

    it('GET /api/eventos?pagina=999 - Deve retornar array vazio para página inexistente', async () => {
        const res = await request(app).get('/api/eventos?pagina=999');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.dados.length).toEqual(0); // Não deve ter nada na página 999
    });
});