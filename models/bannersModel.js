import { openDb } from "../Config/db.js";

export class BannersModel {
    static async getAll() {
        const db = await openDb();
        return db.all('SELECT * FROM banners');
    }

    // Necessário para a edição segura
    static async getById(id) {
        const db = await openDb();
        return db.get('SELECT * FROM banners WHERE id = ?', [id]);
    }

    static async create(dados) {
        const db = await openDb();
        const resultado = await db.run(
            `INSERT INTO banners (titulo, imagem, link) VALUES (?, ?, ?)`,
            [dados.titulo, dados.imagem, dados.link]
        );
        return { id: resultado.lastID, ...dados };
    }

    // NOVO: Método que faltava
    static async update(id, dados) {
        const db = await openDb();
        await db.run(
            `UPDATE banners SET titulo=?, link=?, imagem=? WHERE id=?`,
            [dados.titulo, dados.link, dados.imagem, id]
        );
        return { id, ...dados };
    }

    static async delete(id) {
        const db = await openDb();
        await db.run('DELETE FROM banners WHERE id=?', [id]);
        return { message: "Deletado com sucesso" };
    }
}