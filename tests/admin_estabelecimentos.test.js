import request from 'supertest';
import app from '../app.js';
import { inicializarBanco, openDb } from '../config/db.js';
import bcrypt from 'bcrypt';

describe('Admin - Estabelecimentos (CRUD e Destaque)', () => {
    let cookieAdmin = null;
    let idItem = 0;

    beforeAll(async () => {
        await inicializarBanco();
        const db = await openDb();
        const senhaHash = await bcrypt.hash('senha123', 10);
        try {
            await db.run("INSERT INTO usuarios (login, senha) VALUES ($1, $2)", ['admin_estab', senhaHash]);
        } catch (e) {}
    });

    it('Login do Admin', async () => {
        const res = await request(app).post('/api/login').send({ login: 'admin_estab', senha: 'senha123' });
        expect(res.statusCode).toEqual(200);
        cookieAdmin = res.headers['set-cookie'];
    });

    it('Criar Estabelecimento', async () => {
        const arquivoFake = Buffer.from('foto-hotel');

        const res = await request(app)
            .post('/api/estabelecimentos')
            .set('Cookie', cookieAdmin)
            .field('nome', 'Hotel de Teste')
            .field('categoria', 'hospedagem')
            .field('endereco', 'Rua dos Testes, 100')
            .field('telefone', '(86) 9999-9999')
            .field('descricao', 'Um hotel criado via teste')
            .field('destaque', 0)
            .attach('imagem', arquivoFake, 'hotel.jpg');

        if (res.statusCode !== 201) {
            console.error("FALHA AO CRIAR:", res.body);
        }

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        
        idItem = res.body.id;
    });

    it('Verificar se foi criado (GET)', async () => {
        const res = await request(app).get(`/api/estabelecimentos/${idItem}`);
        
        if (res.statusCode === 404) {
            console.error(`ERRO FATAL: O ID ${idItem} foi gerado mas não encontrado no GET.`);
        }
        expect(res.statusCode).toEqual(200);
    });

    it('Editar Estabelecimento', async () => {
        const arquivoFake = Buffer.from('foto-hotel-nova');

        const res = await request(app)
            .put(`/api/estabelecimentos/${idItem}`)
            .set('Cookie', cookieAdmin)
            .field('nome', 'Hotel Editado')
            .field('categoria', 'hospedagem')
            .field('endereco', 'Rua Nova, 200')
            .field('telefone', '(86) 8888-8888')
            .field('descricao', 'Mudou a descrição')
            .field('destaque', 0)
            .attach('imagem', arquivoFake, 'hotel_novo.jpg');

        if (res.statusCode !== 200) console.error("Erro Editar Estab:", res.body);
        
        expect(res.statusCode).toEqual(200);

        const resCheck = await request(app).get(`/api/estabelecimentos/${idItem}`);
        expect(resCheck.body.nome).toEqual("Hotel Editado");
    });

    it('Alternar Destaque (PATCH)', async () => {
        const res = await request(app)
            .patch(`/api/estabelecimentos/${idItem}/destaque`)
            .set('Cookie', cookieAdmin)
            .send({ destaque: true });

        if (res.statusCode !== 200) console.error("Erro Destaque:", res.body);

        expect(res.statusCode).toEqual(200);
        
        const resCheck = await request(app).get(`/api/estabelecimentos/${idItem}`);
        expect(resCheck.body.destaque).toBeTruthy(); 
    });

    it('Deletar Estabelecimento', async () => {
        const res = await request(app)
            .delete(`/api/estabelecimentos/${idItem}`)
            .set('Cookie', cookieAdmin);
        expect(res.statusCode).toEqual(200);
    });
});