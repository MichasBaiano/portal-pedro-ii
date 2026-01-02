import { openDb } from "../Config/db.js";

export class DashboardController {
    static async getStats(req, res) {
        try {
            const db = await openDb();
            
            // Fazemos 3 contagens rápidas no banco
            const eventos = await db.get("SELECT count(*) as total FROM eventos");
            const locais = await db.get("SELECT count(*) as total FROM estabelecimentos");
            const sugestoes = await db.get("SELECT count(*) as total FROM sugestoes");
            
            res.json({
                eventos: eventos.total || 0,
                locais: locais.total || 0,
                sugestoes: sugestoes.total || 0
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao buscar estatísticas" });
        }
    }
}