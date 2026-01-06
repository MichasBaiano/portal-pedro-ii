import { DashboardModel } from "../model/dashboardModel.js";

export class DashboardController {
    static async getStats(req, res) {
        try {
            // Busca todas as contagens de uma vez só
            const stats = await DashboardModel.getStats();
            
            res.json(stats);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao buscar estatísticas" });
        }
    }
}