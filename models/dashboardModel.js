import { openDb } from "../config/db.js";

export class DashboardModel {
    static async getStats() {
        const db = await openDb();
        // Query otimizada: conta tudo de uma vez
        return db.get(`
            SELECT 
                (SELECT COUNT(*) FROM eventos) as eventos,
                (SELECT COUNT(*) FROM estabelecimentos) as locais,
                (SELECT COUNT(*) FROM sugestoes) as sugestoes
        `);
    }
}