import { openDb } from "../config/db.js";

export class DashboardModel {
    static async getStats() {
        const db = await openDb();
        // A sintaxe aqui é SQL padrão, funciona igual no Postgres
        return db.get(`
            SELECT 
                (SELECT COUNT(*) FROM eventos) as eventos,
                (SELECT COUNT(*) FROM estabelecimentos) as locais,
                (SELECT COUNT(*) FROM sugestoes) as sugestoes
        `);
    }
}