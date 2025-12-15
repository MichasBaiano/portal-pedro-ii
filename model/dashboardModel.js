import { openDb } from "../Config/db.js";

export class DashboardModel {
    static async getTotais() {
        const db = await openDb();
        // Faz várias contagens numa única consulta SQL
        return db.get(`
            SELECT 
                (SELECT COUNT(*) FROM eventos) AS eventos,
                (SELECT COUNT(*) FROM estabelecimentos) AS estabelecimentos,
                (SELECT COUNT(*) FROM transportes) AS transportes,
                (SELECT COUNT(*) FROM sugestoes) AS sugestoes,
                (SELECT COUNT(*) FROM banners) AS banners
        `);
    }
}