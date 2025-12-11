import { EstabelecimentosModel } from "../model/estabelecimentoModel.js";

export class EstabelecimentosController {
    static async listar(req, res) {
        try {
            const locais = await EstabelecimentosModel.getAll();
            res.json(locais);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao buscar locais." });
        }
    }
}