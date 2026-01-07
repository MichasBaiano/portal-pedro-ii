import { openDb } from "../Config/db.js";

export class AvaliacaoModel {
    // Busca avaliações de um item específico 
    static async getByItem(itemId, tipo) {
        const db = await openDb();
        return db.all('SELECT * FROM avaliacoes WHERE item_id = ? AND tipo = ? ORDER BY id DESC', [itemId, tipo]);
    }

    // Salva uma nova avaliação
    static async create(dados) {
        const db = await openDb();
        await db.run(
            `INSERT INTO avaliacoes (item_id, tipo, nota, comentario, autor, data) VALUES (?, ?, ?, ?, ?, ?)`,
            [dados.itemId, dados.tipo, dados.nota, dados.comentario, dados.autor, new Date().toISOString()]
        );
    }

    // Calcula a média de estrelas 
    static async getMedia(itemId, tipo) {
        const db = await openDb();
        const resultado = await db.get(
            'SELECT AVG(nota) as media, COUNT(*) as total FROM avaliacoes WHERE item_id = ? AND tipo = ?',
            [itemId, tipo]
        );
        return resultado;
    }
}