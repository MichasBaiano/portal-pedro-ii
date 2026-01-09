import request from 'supertest';
import app from '../app.js';
import { inicializarBanco, openDb } from '../config/db.js';
import bcrypt from 'bcrypt';

describe('Admin - Banners (CRUD)', () => {
    let cookieAdmin = null;
    let idItem = 0;

    beforeAll(async () => {
        await inicializarBanco();
        const db = await openDb();
        const senhaHash = await bcrypt.hash('senha123', 10);
        try {
            await db.run("INSERT INTO usuarios (login, senha) VALUES (?, ?)", ['admin_banner', senhaHash]);
        } catch (e) {}
    });

    it('Login do Admin', async () => {
        const res = await request(app).post('/api/login').send({ login: 'admin_banner', senha: 'senha123' });
        cookieAdmin = res.headers['set-cookie'];
        expect(res.statusCode).toEqual(200);
    });

    it('Criar Banner', async () => {
        const arquivoFake = Buffer.from('conteudo-da-imagem-fake');

        const res = await request(app)
            .post('/api/banners')
            .set('Cookie', cookieAdmin)
            .field('titulo', 'Banner Promo')
            .field('link', 'https://google.com')
            .attach('imagem', arquivoFake, 'banner_teste.jpg');

        expect(res.statusCode).toEqual(201);
        // Garante que o ID veio e é um número
        expect(res.body).toHaveProperty('id');
        idItem = res.body.id;
    });

    it('Editar Banner', async () => {
        const arquivoFake = Buffer.from('nova-imagem');

        // 1. Faz a edição
        const res = await request(app)
            .put(`/api/banners/${idItem}`)
            .set('Cookie', cookieAdmin)
            .field('titulo', 'Banner Editado') // Mudamos o título
            .field('link', 'https://bing.com')
            .attach('imagem', arquivoFake, 'banner_novo.jpg');

        expect(res.statusCode).toEqual(200);

        // 2. VERIFICAÇÃO REAL: Busca o item no banco para ver se mudou mesmo
        const resCheck = await request(app).get('/api/banners');
        // Acha o banner que editamos dentro da lista
        const bannerEditado = resCheck.body.find(b => b.id === idItem);
        
        expect(bannerEditado).toBeDefined();
        expect(bannerEditado.titulo).toEqual("Banner Editado");
    });

    it('Deletar Banner', async () => {
        const res = await request(app)
            .delete(`/api/banners/${idItem}`)
            .set('Cookie', cookieAdmin);
        expect(res.statusCode).toEqual(200);
    });
});