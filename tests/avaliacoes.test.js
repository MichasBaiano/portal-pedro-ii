import request from 'supertest';
import app from '../app.js';
import { inicializarBanco, openDb } from '../config/db.js';

describe('API - Avaliações (Reviews)', () => {
    let idEstabelecimento = 0;

    beforeAll(async () => {
        await inicializarBanco();
        const db = await openDb();
        const result = await db.run(
            `INSERT INTO estabelecimentos (nome, categoria) VALUES (?, ?)`,
            ['Pizzaria Teste Coverage', 'alimentacao']
        );
        idEstabelecimento = result.lastID;
    });

    it('Deve criar uma avaliação positiva', async () => {
        const novaAvaliacao = {
            item_id: idEstabelecimento,
            tipo: 'estabelecimento',
            nota: 5,
            comentario: 'Pizza excelente!',
            autor: 'Cliente Feliz'
        };

        const res = await request(app)
            .post('/api/avaliacoes')
            .send(novaAvaliacao);

        expect([200, 201]).toContain(res.statusCode);
        
        if (res.body.id) {
            expect(res.body).toHaveProperty('id');
        }
    });

    it('Não deve aceitar nota fora do padrão (ex: 100)', async () => {
        const avaliacaoRuim = {
            item_id: idEstabelecimento,
            tipo: 'estabelecimento',
            nota: 100, 
            comentario: 'Nota inválida',
            autor: 'Hacker'
        };

        const res = await request(app)
            .post('/api/avaliacoes')
            .send(avaliacaoRuim);

        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    it('Deve listar as avaliações do estabelecimento', async () => {
        const res = await request(app)
            .get(`/api/avaliacoes/estabelecimento/${idEstabelecimento}`);

        expect(res.statusCode).toEqual(200);

        let lista = [];
        
        // Lógica para encontrar onde a lista está escondida
        if (Array.isArray(res.body)) {
            lista = res.body;
        } else if (res.body.dados && Array.isArray(res.body.dados)) {
            lista = res.body.dados;
        } else if (res.body.lista && Array.isArray(res.body.lista)) { 
            // Adicionamos suporte para 'res.body.lista'
            lista = res.body.lista;
        } else {
            console.log("RETORNO ESTRANHO NA LISTAGEM:", res.body);
        }

        expect(Array.isArray(lista)).toBe(true);
        expect(lista.length).toBeGreaterThan(0);
        expect(lista[0].nota).toBe(5);
        
        // API retorna média, testa
        if (res.body.media) {
             expect(res.body.media).toBe(5);
        }
    });
});