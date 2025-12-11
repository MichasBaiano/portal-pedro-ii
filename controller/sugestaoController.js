import { SugestaoModel } from "../model/sugestaoModel.js";

export class SugestaoController {
    static async enviarSugestao(req, res) {
        const dados = req.body;
        
        if (!dados.nome || !dados.mensagem) {
            return res.status(400).json({ erro: "Nome e mensagem são obrigatórios." });
        }

        try {
            const salva = await SugestaoModel.salvar(dados);
            
            res.status(201).json({ 
                mensagem: "Sugestão salva no banco com sucesso!", 
                id: salva.id 
            });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao salvar no banco." });
        }
    }
}