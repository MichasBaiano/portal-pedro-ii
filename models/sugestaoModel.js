import { openDb } from "../config/db.js";

export class SugestaoModel {
    static async salvar(dados) {
        const db = await openDb();
        const resultado = await db.run(
            `INSERT INTO sugestoes (tipo, nome, email, mensagem) VALUES ($1, $2, $3, $4) RETURNING id`,
            [dados.tipo, dados.nome, dados.email, dados.mensagem]
        );
        return { id: resultado.lastID, ...dados };
    }

    static async listarTodas() {
        const db = await openDb();
        return db.all('SELECT * FROM sugestoes ORDER BY id DESC');
    }

    static async delete(id) {
        const db = await openDb();
        await db.run('DELETE FROM sugestoes WHERE id=$1', [id]);
        return { message: "Deletado com sucesso" };
    }
}