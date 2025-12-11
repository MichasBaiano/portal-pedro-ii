import { openDb } from "../Config/db.js";

export class EventosModel {
    // LEITURA (Já existia)
    static async getAll() {
        const db = await openDb();
        return db.all('SELECT * FROM eventos');
    }

    // CRIAÇÃO (Novo)
    static async create(dados) {
        const db = await openDb();
        const resultado = await db.run(
            `INSERT INTO eventos (nome, data, local, categoria, descricao, imagem) VALUES (?, ?, ?, ?, ?, ?)`,
            [dados.nome, dados.data, dados.local, dados.categoria, dados.descricao, dados.imagem]
        );
        return { id: resultado.lastID, ...dados };
    }

    // ATUALIZAÇÃO (Novo)
    static async update(id, dados) {
        const db = await openDb();
        await db.run(
            `UPDATE eventos SET nome=?, data=?, local=?, categoria=?, descricao=?, imagem=? WHERE id=?`,
            [dados.nome, dados.data, dados.local, dados.categoria, dados.descricao, dados.imagem, id]
        );
        return { id, ...dados };
    }

    // EXCLUSÃO (Novo)
    static async delete(id) {
        const db = await openDb();
        await db.run('DELETE FROM eventos WHERE id=?', [id]);
        return { message: "Deletado com sucesso" };
    }
}