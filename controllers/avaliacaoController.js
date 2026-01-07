import { AvaliacaoModel } from "../models/avaliacaoModel.js";

export class AvaliacaoController {
    static async listar(req, res) {
        const { tipo, id } = req.params;
        try {
            const avaliacoes = await AvaliacaoModel.getByItem(id, tipo);
            const stats = await AvaliacaoModel.getMedia(id, tipo);
            res.json({ lista: avaliacoes, media: stats.media || 0, total: stats.total });
        } catch (erro) {
            res.status(500).json({ error: "Erro ao buscar avaliações" });
        }
    }

    static async adicionar(req, res) {
        const { item_id, tipo, nota, comentario, autor } = req.body;
        try {            
            await AvaliacaoModel.create({ itemId: item_id, tipo, nota, comentario, autor });
            res.json({ sucesso: true });
        } catch (erro) {
            res.status(500).json({ error: "Erro ao salvar avaliação" });
        }
    }
}