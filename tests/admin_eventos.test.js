import request from 'supertest';
import app from '../app.js';
import { inicializarBanco, openDb } from '../config/db.js';
import bcrypt from 'bcrypt';
import { jest } from '@jest/globals';

jest.setTimeout(30000);

describe('Testes Administrativos - Ciclo de Vida de Eventos (Sessão)', () => {
    let cookieAdmin = null;
    let idEventoCriado = 0;

    beforeAll(async () => {
        await inicializarBanco();
        const db = await openDb();

        const senhaHash = await bcrypt.hash('senha123', 10);
        
        try {
            await db.run(
                `INSERT INTO usuarios (login, senha) VALUES ($1, $2)`,
                ['admin_teste', senhaHash]
            );
        } catch (e) {}
    });

    it('Deve fazer login e receber um Cookie de sessão', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({
                login: 'admin_teste',
                senha: 'senha123'
            });

        expect(res.statusCode).toEqual(200);
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        cookieAdmin = cookies;
    });

    it('Deve redirecionar (302) se tentar criar sem estar logado', async () => {
        const res = await request(app)
            .post('/api/eventos')
            .send({ nome: 'Evento Hacker' }); 

        expect(res.statusCode).toEqual(302);
        expect(res.header.location).toContain('/login');
    });

    it('Deve criar um evento autenticado (com Cookie)', async () => {
        const novoEvento = {
            nome: "Evento de Teste Automatizado",
            data: "2025-12-31",
            local: "Laboratório de Código",
            categoria: "Tecnologia",
            descricao: "Um teste de integração",
            imagem: "caminho/fake.jpg" 
        };

        const res = await request(app)
            .post('/api/eventos')
            .set('Cookie', cookieAdmin)
            .send(novoEvento);

        if (res.statusCode !== 201) console.error("Erro criação:", res.body);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        
        idEventoCriado = res.body.id;
    });

    it('Deve editar o evento criado', async () => {
        const atualizacao = {
            nome: "Evento Editado pelo Robô",
            data: "2026-01-01",
            local: "Novo Local",
            categoria: "Tecnologia",
            descricao: "Editado",
            imagem: "caminho/fake.jpg"
        };

        const res = await request(app)
            .put(`/api/eventos/${idEventoCriado}`)
            .set('Cookie', cookieAdmin)
            .send(atualizacao);

        expect(res.statusCode).toEqual(200);
        expect(res.body.nome).toEqual("Evento Editado pelo Robô");
    });

    it('Deve deletar o evento', async () => {
        const res = await request(app)
            .delete(`/api/eventos/${idEventoCriado}`)
            .set('Cookie', cookieAdmin);

        expect(res.statusCode).toEqual(200);
    });

    it('O evento deletado não deve mais existir', async () => {
        const res = await request(app).get(`/api/eventos/${idEventoCriado}`);
        if (res.statusCode === 200) {
           expect(res.body).toBeFalsy(); 
        } else {
           expect(res.statusCode).toBe(404);
        }
    });
});