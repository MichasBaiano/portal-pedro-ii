import { openDb } from "../config/db.js";

export class EstabelecimentosModel {
    static async getAll(limite = null, offset = 0) {
        const db = await openDb();
        if (limite) {
            return db.all('SELECT * FROM estabelecimentos LIMIT ? OFFSET ?', [limite, offset]);
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
        // CORREÇÃO: Tabela 'estabelecimentos' e campos corretos (endereco, telefone, destaque...)
        const resultado = await db.run(
            `INSERT INTO estabelecimentos (nome, categoria, endereco, telefone, descricao, imagem, destaque, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [dados.nome, dados.categoria, dados.endereco, dados.telefone, dados.descricao, dados.imagem, dados.destaque || 0, dados.latitude, dados.longitude]
        );
        return { id: resultado.lastID, ...dados };
    }

    static async update(id, dados) {
        const db = await openDb();
        // CORREÇÃO: Tabela 'estabelecimentos' e campos corretos
        await db.run(
            `UPDATE estabelecimentos SET nome=?, categoria=?, endereco=?, telefone=?, descricao=?, imagem=?, destaque=?, latitude=?, longitude=? WHERE id=?`,
            [dados.nome, dados.categoria, dados.endereco, dados.telefone, dados.descricao, dados.imagem, dados.destaque || 0, dados.latitude, dados.longitude, id]
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