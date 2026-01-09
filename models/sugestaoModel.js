import { openDb } from "../config/db.js";

export class SugestaoModel {
    static async salvar(dados) {
        const db = await openDb();
        const resultado = await db.run(
            `INSERT INTO sugestoes (tipo, nome, email, mensagem) VALUES (?, ?, ?, ?)`,
            [dados.tipo, dados.nome, dados.email, dados.mensagem]
        );
        return { id: resultado.lastID, ...dados };
    }

    static async listarTodas() {
        const db = await openDb();
        // Ordena por ID decrescente (as mais novas primeiro)
        return db.all('SELECT * FROM sugestoes ORDER BY id DESC');
    }

    // NOVO: Função para deletar
    static async delete(id) {
        const db = await openDb();
        await db.run('DELETE FROM sugestoes WHERE id=?', [id]);
        return { message: "Deletado com sucesso" };
    }
}