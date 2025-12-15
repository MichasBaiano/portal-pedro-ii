import { openDb } from "../Config/db.js";

export class EstabelecimentosModel {
    static async getAll() {
        const db = await openDb();
        return db.all('SELECT * FROM estabelecimentos');
    }

    static async create(dados) {
        const db = await openDb();
        const destaque = dados.destaque ? 1 : 0; // Converte true/false para 1/0
        const resultado = await db.run(
            `INSERT INTO estabelecimentos (nome, categoria, endereco, telefone, descricao, imagem, destaque) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [dados.nome, dados.categoria, dados.endereco, dados.telefone, dados.descricao, dados.imagem, destaque]
        );
        return { id: resultado.lastID, ...dados };
    }

    static async update(id, dados) {
        const db = await openDb();
        const destaque = dados.destaque ? 1 : 0;
        await db.run(
            `UPDATE estabelecimentos SET nome=?, categoria=?, endereco=?, telefone=?, descricao=?, imagem=?, destaque=? WHERE id=?`,
            [dados.nome, dados.categoria, dados.endereco, dados.telefone, dados.descricao, dados.imagem, destaque, id]
        );
        return { id, ...dados };
    }

    static async delete(id) {
        const db = await openDb();
        await db.run('DELETE FROM estabelecimentos WHERE id=?', [id]);
        return { message: "Deletado com sucesso" };
    }

    static async getById(id) {
        const db = await openDb();
        return db.get('SELECT * FROM estabelecimentos WHERE id = ?', [id]);
    }

    // Pesquisa por nome ou descrição
    static async search(termo) {
        const db = await openDb();
        return db.all('SELECT * FROM estabelecimentos WHERE nome LIKE ? OR descricao LIKE ?', [`%${termo}%`, `%${termo}%`]);
    }
}