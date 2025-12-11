import { TransportesModel } from "../model/transporteModel.js";

export class TransportesController {
    static async listar(req, res) {
        try {
            const dados = await TransportesModel.getAll();
            res.json(dados);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao buscar transportes." });
        }
    }
}