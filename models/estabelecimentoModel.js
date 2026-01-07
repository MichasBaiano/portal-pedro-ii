import { openDb } from "../Config/db.js";

export class EstabelecimentosModel {
    static async getAll() {
        const db = await openDb();
        return db.all('SELECT * FROM estabelecimentos');
    }

    static async create(dados) {
        const db = await openDb();
        const resultado = await db.run(
            `INSERT INTO eventos (nome, data, local, latitude, longitude, categoria, descricao, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [dados.nome, dados.data, dados.local, dados.latitude, dados.longitude, dados.categoria, dados.descricao, dados.imagem]
        );
        return { id: resultado.lastID, ...dados };
    }

    static async update(id, dados) {
        const db = await openDb();
        await db.run(
            `UPDATE eventos SET nome=?, data=?, local=?, latitude=?, longitude=?, categoria=?, descricao=?, imagem=? WHERE id=?`,
            [dados.nome, dados.data, dados.local, dados.latitude, dados.longitude, dados.categoria, dados.descricao, dados.imagem, id]
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

    // Busca aleatória de destaques para a Home
    static async getDestaques(limite) {
        const db = await openDb();
        return db.all(`SELECT * FROM estabelecimentos WHERE destaque = 1 ORDER BY RANDOM() LIMIT ?`, [limite]);
    }

    // Busca apenas quem tem latitude/longitude para o Mapa
    static async getComCoordenadas() {
        const db = await openDb();
        return db.all("SELECT id, nome, categoria, latitude, longitude, imagem FROM estabelecimentos WHERE latitude IS NOT NULL");
    }

    // Alternar apenas o status de destaque
    static async updateDestaque(id, status) {
        const db = await openDb();
        await db.run('UPDATE estabelecimentos SET destaque = ? WHERE id = ?', [status, id]);
    }
}