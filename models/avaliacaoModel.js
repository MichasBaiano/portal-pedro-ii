import { openDb } from "../config/db.js";

export class AvaliacaoModel {
    static async getByItem(itemId, tipo) {
        const db = await openDb();
        return db.all('SELECT * FROM avaliacoes WHERE item_id = $1 AND tipo = $2 ORDER BY id DESC', [itemId, tipo]);
    }

    static async create(dados) {
        const db = await openDb();
        // CURRENT_TIMESTAMP funciona melhor no PG do que passar ISOString manualmente, mas mantive a lógica do JS
        await db.run(
            `INSERT INTO avaliacoes (item_id, tipo, nota, comentario, autor, data) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [dados.itemId, dados.tipo, dados.nota, dados.comentario, dados.autor, new Date().toISOString()]
        );
    }

    static async getMedia(itemId, tipo) {
        const db = await openDb();
        const resultado = await db.get(
            'SELECT AVG(nota)::FLOAT as media, COUNT(*)::INTEGER as total FROM avaliacoes WHERE item_id = $1 AND tipo = $2',
            [itemId, tipo]
        );
        if (!resultado) return { media: 0, total: 0 };

        return resultado;
    }
}