import { openDb } from "../config/db.js";

export class TransportesModel {
    static async getAll(limite = null, offset = 0) {
        const db = await openDb();
        if (limite) {
            return db.all('SELECT * FROM transportes LIMIT $1 OFFSET $2', [limite, offset]);
        } else {
            return db.all('SELECT * FROM transportes');
        }
    }

    static async countTotal() {
        const db = await openDb();
        const resultado = await db.get('SELECT COUNT(*) as total FROM transportes');
        return resultado.total;
    }

    static async create(dados) {
        const db = await openDb();
        const resultado = await db.run(
            `INSERT INTO transportes (tipo, nome, rota, horarios, contato, icone) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [dados.tipo, dados.nome, dados.rota, dados.horarios, dados.contato, dados.icone]
        );
        return { id: resultado.lastID, ...dados };
    }

    static async update(id, dados) {
        const db = await openDb();
        // ID é o $7
        await db.run(
            `UPDATE transportes SET tipo=$1, nome=$2, rota=$3, horarios=$4, contato=$5, icone=$6 WHERE id=$7`,
            [dados.tipo, dados.nome, dados.rota, dados.horarios, dados.contato, dados.icone, id]
        );
        return { id, ...dados };
    }

    static async delete(id) {
        const db = await openDb();
        await db.run('DELETE FROM transportes WHERE id=$1', [id]);
        return { message: "Deletado com sucesso" };
    }
}