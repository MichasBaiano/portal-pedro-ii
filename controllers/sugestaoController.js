import { SugestaoModel } from "../models/sugestaoModel.js";

export class SugestaoController {
    static async enviarSugestao(req, res) {
        // ... (Mantenha o código de enviarSugestao igual estava) ...
        const dados = req.body;
        if (!dados.nome || !dados.mensagem) {
            return res.status(400).json({ erro: "Nome e mensagem são obrigatórios." });
        }
        try {
            const salva = await SugestaoModel.salvar(dados);
            res.status(201).json({ mensagem: "Sugestão salva!", id: salva.id });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao salvar." });
        }
    }

    // NOVO: Listar para o Admin
    static async listar(req, res) {
        try {
            const lista = await SugestaoModel.listarTodas();
            res.json(lista);
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao buscar sugestões." });
        }
    }

    // NOVO: Deletar
    static async deletar(req, res) {
        try {
            await SugestaoModel.delete(req.params.id);
            res.json({ message: "Sugestão removida." });
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao deletar." });
        }
    }
}