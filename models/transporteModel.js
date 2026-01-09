import { openDb } from "../config/db.js";

export class TransportesModel {
    static async getAll(limite = null, offset = 0) {
        const db = await openDb();
        if (limite) {
            return db.all('SELECT * FROM transportes LIMIT ? OFFSET ?', [limite, offset]);
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
            `INSERT INTO transportes (tipo, nome, rota, horarios, contato, icone) VALUES (?, ?, ?, ?, ?, ?)`,
            [dados.tipo, dados.nome, dados.rota, dados.horarios, dados.contato, dados.icone]
        );
        return { id: resultado.lastID, ...dados };
    }

    static async update(id, dados) {
        const db = await openDb();
        await db.run(
            `UPDATE transportes SET tipo=?, nome=?, rota=?, horarios=?, contato=?, icone=? WHERE id=?`,
            [dados.tipo, dados.nome, dados.rota, dados.horarios, dados.contato, dados.icone, id]
        );
        return { id, ...dados };
    }

    static async delete(id) {
        const db = await openDb();
        await db.run('DELETE FROM transportes WHERE id=?', [id]);
        return { message: "Deletado com sucesso" };
    }
}