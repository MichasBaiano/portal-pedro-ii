import { openDb } from "../config/db.js";

export class EstabelecimentosModel {
    static async getAll(limite = null, offset = 0) {
        const db = await openDb();
        if (limite) {
            return db.all('SELECT * FROM estabelecimentos LIMIT $1 OFFSET $2', [limite, offset]);
        } else {
            return db.all('SELECT * FROM estabelecimentos');
        }
    }

    static async countTotal() {
        const db = await openDb();
        const resultado = await db.get('SELECT COUNT(*) as total FROM estabelecimentos');
        return resultado.total;
    }

    static async create(dados) {
        const db = await openDb();
        // Campos $1 a $9
        const resultado = await db.run(
            `INSERT INTO estabelecimentos (nome, categoria, endereco, telefone, descricao, imagem, destaque, latitude, longitude) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
            [
                dados.nome, 
                dados.categoria, 
                dados.endereco, 
                dados.telefone, 
                dados.descricao, 
                dados.imagem, 
                dados.destaque || 0, 
                dados.latitude, 
                dados.longitude
            ]
        );
        return { id: resultado.lastID, ...dados };
    }

    static async update(id, dados) {
        const db = await openDb();
        // Campos $1 a $9, ID é $10
        await db.run(
            `UPDATE estabelecimentos SET nome=$1, categoria=$2, endereco=$3, telefone=$4, descricao=$5, imagem=$6, destaque=$7, latitude=$8, longitude=$9 WHERE id=$10`,
            [
                dados.nome, 
                dados.categoria, 
                dados.endereco, 
                dados.telefone, 
                dados.descricao, 
                dados.imagem, 
                dados.destaque || 0, 
                dados.latitude, 
                dados.longitude, 
                id
            ]
        );
        return { id, ...dados };
    }

    static async delete(id) {
        const db = await openDb();
        await db.run('DELETE FROM estabelecimentos WHERE id=$1', [id]);
        return { message: "Deletado com sucesso" };
    }

    static async getById(id) {
        const db = await openDb();
        return db.get('SELECT * FROM estabelecimentos WHERE id = $1', [id]);
    }

    static async search(termo) {
        const db = await openDb();
        // ILIKE para ignorar maiuscula/minuscula
        return db.all('SELECT * FROM estabelecimentos WHERE nome ILIKE $1 OR descricao ILIKE $2', [`%${termo}%`, `%${termo}%`]);
    }

    static async getDestaques(limite) {
        const db = await openDb();
        return db.all(`SELECT * FROM estabelecimentos WHERE destaque = 1 ORDER BY RANDOM() LIMIT $1`, [limite]);
    }

    static async getComCoordenadas() {
        const db = await openDb();
        return db.all("SELECT id, nome, categoria, latitude, longitude, imagem FROM estabelecimentos WHERE latitude IS NOT NULL");
    }

    static async updateDestaque(id, status) {
        const db = await openDb();
        await db.run('UPDATE estabelecimentos SET destaque = $1 WHERE id = $2', [status, id]);
    }
}