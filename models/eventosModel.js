import { openDb } from "../config/db.js";

export class EventosModel {
    static async getAll(limite = null, offset = 0) {
        const db = await openDb();
        if (limite) {
            // Postgres usa $1, $2...
            return db.all('SELECT * FROM eventos ORDER BY data DESC LIMIT $1 OFFSET $2', [limite, offset]);
        } else {
            return db.all('SELECT * FROM eventos ORDER BY data DESC');
        }
    }

    static async countTotal() {
        const db = await openDb();
        const resultado = await db.get('SELECT COUNT(*) as total FROM eventos');
        return resultado.total;
    }

    static async create(dados) {
        const db = await openDb();
        // Adicionado RETURNING id e trocado ? por $
        const resultado = await db.run(
            `INSERT INTO eventos (nome, data, local, categoria, descricao, imagem) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [dados.nome, dados.data, dados.local, dados.categoria, dados.descricao, dados.imagem]
        );
        return { id: resultado.lastID, ...dados };
    }

    static async update(id, dados) {
        const db = await openDb();
        // ID é o $7 (último parametro)
        await db.run(
            `UPDATE eventos SET nome=$1, data=$2, local=$3, categoria=$4, descricao=$5, imagem=$6 WHERE id=$7`,
            [dados.nome, dados.data, dados.local, dados.categoria, dados.descricao, dados.imagem, id]
        );
        return { id, ...dados };
    }

    static async delete(id) {
        const db = await openDb();
        await db.run('DELETE FROM eventos WHERE id=$1', [id]);
        return { message: "Deletado com sucesso" };
    }

    static async getById(id) {
        const db = await openDb();
        return db.get('SELECT * FROM eventos WHERE id = $1', [id]);
    }

    static async search(termo) {
        const db = await openDb();
        return db.all('SELECT * FROM eventos WHERE nome ILIKE $1 OR descricao ILIKE $2', [`%${termo}%`, `%${termo}%`]); 
        // ILIKE no Postgres ignora maiusculas/minusculas (Case Insensitive)
    }

    static async getProximos(limite) {
        const db = await openDb();
        // CURRENT_DATE é o padrão SQL, mas date('now') funciona em alguns contextos
        return db.all(`SELECT * FROM eventos WHERE data >= CURRENT_DATE ORDER BY data ASC LIMIT $1`, [limite]);
    }

    static async getComCoordenadas() {
        const db = await openDb();
        return db.all("SELECT id, nome, categoria, latitude, longitude, imagem FROM eventos WHERE latitude IS NOT NULL");
    }
}