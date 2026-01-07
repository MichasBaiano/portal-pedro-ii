import { openDb } from "../Config/db.js";

export class EventosModel {
    // LEITURA 
    static async getAll(limite = null, offset = 0) {
        const db = await openDb();
        // Adiciona um limite para não travar em uma requisição
        if (limite) {
            return db.all('SELECT * FROM eventos ORDER BY data DESC LIMIT ? OFFSET ?', [limite, offset]);
        } else {
            return db.all('SELECT * FROM eventos ORDER BY data DESC');
        }
    }

    // Contar total de páginas
    static async countTotal() {
        const db = await openDb();
        const resultado = await db.get('SELECT COUNT(*) as total FROM eventos');
        return resultado.total;
    }

    // CRIAÇÃO 
    static async create(dados) {
        const db = await openDb();
        const resultado = await db.run(
            `INSERT INTO eventos (nome, data, local, categoria, descricao, imagem) VALUES (?, ?, ?, ?, ?, ?)`,
            [dados.nome, dados.data, dados.local, dados.categoria, dados.descricao, dados.imagem]
        );
        return { id: resultado.lastID, ...dados };
    }

    // ATUALIZAÇÃO 
    static async update(id, dados) {
        const db = await openDb();
        await db.run(
            `UPDATE eventos SET nome=?, data=?, local=?, categoria=?, descricao=?, imagem=? WHERE id=?`,
            [dados.nome, dados.data, dados.local, dados.categoria, dados.descricao, dados.imagem, id]
        );
        return { id, ...dados };
    }

    // EXCLUSÃO
    static async delete(id) {
        const db = await openDb();
        await db.run('DELETE FROM eventos WHERE id=?', [id]);
        return { message: "Deletado com sucesso" };
    }

    static async getById(id) {
        const db = await openDb();
        return db.get('SELECT * FROM eventos WHERE id = ?', [id]);
    }

    // Pesquisa por nome ou descrição
    static async search(termo) {
        const db = await openDb();
        // O símbolo % significa "qualquer coisa antes ou depois"
        return db.all('SELECT * FROM eventos WHERE nome LIKE ? OR descricao LIKE ?', [`%${termo}%`, `%${termo}%`]);
    }

    // Puxa os próximos
    static async getProximos(limite) {
        const db = await openDb();
        return db.all(`SELECT * FROM eventos WHERE data >= date('now') ORDER BY data ASC LIMIT ?`, [limite]);
    }

    // Busca específica para o MAPA
    static async getComCoordenadas() {
        const db = await openDb();
        return db.all("SELECT id, nome, categoria, latitude, longitude, imagem FROM eventos WHERE latitude IS NOT NULL");
    }
}