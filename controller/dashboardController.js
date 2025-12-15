import { DashboardModel } from "../model/dashboardModel.js";

export class DashboardController {
    static async getStats(req, res) {
        try {
            const totais = await DashboardModel.getTotais();
            res.json(totais);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao buscar estatísticas." });
        }
    }
}