import request from 'supertest';
import app from '../app.js';
import { inicializarBanco, openDb } from '../config/db.js';
import bcrypt from 'bcrypt';

describe('Admin - Transportes (CRUD)', () => {
    let cookieAdmin = null;
    let idItem = 0;

    beforeAll(async () => {
        await inicializarBanco();
        const db = await openDb();
        const senhaHash = await bcrypt.hash('senha123', 10);
        try {
            await db.run("INSERT INTO usuarios (login, senha) VALUES ($1, $2)", ['admin_transp', senhaHash]);
        } catch (e) {}
    });

    it('Login do Admin', async () => {
        const res = await request(app).post('/api/login').send({ login: 'admin_transp', senha: 'senha123' });
        cookieAdmin = res.headers['set-cookie'];
        expect(res.statusCode).toEqual(200);
    });

    it('Criar Transporte', async () => {
        const novo = {
            tipo: "onibus",
            nome: "Viação Teste",
            rota: "Pedro II -> Teresina",
            horarios: "08:00, 18:00",
            contato: "(86) 3333-3333",
            icone: "🚌"
        };

        const res = await request(app)
            .post('/api/transportes')
            .set('Cookie', cookieAdmin)
            .send(novo);

        expect(res.statusCode).toEqual(201);
        idItem = res.body.id;
    });

    it('Editar Transporte', async () => {
        const editado = {
            tipo: "van",
            nome: "Van do Teste",
            rota: "Pedro II -> Piripiri",
            horarios: "07:00",
            contato: "(86) 2222-2222",
            icone: "🚐"
        };

        const res = await request(app)
            .put(`/api/transportes/${idItem}`)
            .set('Cookie', cookieAdmin)
            .send(editado);

        expect(res.statusCode).toEqual(200);
        expect(res.body.nome).toEqual("Van do Teste");
    });

    it('Deletar Transporte', async () => {
        const res = await request(app)
            .delete(`/api/transportes/${idItem}`)
            .set('Cookie', cookieAdmin);
        expect(res.statusCode).toEqual(200);
    });
});