import { openDb } from "../config/db.js";

export class BannersModel {
    static async getAll() {
        const db = await openDb();
        return db.all('SELECT * FROM banners');
    }

    static async getById(id) {
        const db = await openDb();
        return db.get('SELECT * FROM banners WHERE id = $1', [id]);
    }

    static async create(dados) {
        const db = await openDb();
        const resultado = await db.run(
            `INSERT INTO banners (titulo, imagem, link) VALUES ($1, $2, $3) RETURNING id`,
            [dados.titulo, dados.imagem, dados.link]
        );
        return { id: resultado.lastID, ...dados };
    }

    static async update(id, dados) {
        const db = await openDb();
        await db.run(
            `UPDATE banners SET titulo=$1, link=$2, imagem=$3 WHERE id=$4`,
            [dados.titulo, dados.link, dados.imagem, id]
        );
        return { id, ...dados };
    }

    static async delete(id) {
        const db = await openDb();
        await db.run('DELETE FROM banners WHERE id=$1', [id]);
        return { message: "Deletado com sucesso" };
    }
}