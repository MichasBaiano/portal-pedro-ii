import { openDb } from "../Config/db.js";

export class TransportesModel {
    static async getAll() {
        const db = await openDb();
        return db.all('SELECT * FROM transportes');
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