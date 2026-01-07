import { BannersModel } from "../models/bannersModel.js";
import { FileHelper } from "../utils/fileHelper.js";

export class BannersController {
    static async listar(req, res) {
        try {
            const banners = await BannersModel.getAll();
            res.json(banners);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao buscar banners." });
        }
    }

    static async criar(req, res) {
        try {
            let dados = req.body;
            // Usa o helper (passa null pois não existe 'antigo' na criação)
            dados.imagem = FileHelper.processarImagem(req, null);

            if (!dados.imagem) return res.status(400).json({ erro: "Imagem obrigatória." });

            const novo = await BannersModel.create(dados);
            res.status(201).json(novo);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao criar banner." });
        }
    }

    static async deletar(req, res) {
        try {
            const { id } = req.params;
            // Busca o item antes de deletar para pegar o nome da imagem
            const item = await BannersModel.getById(id);

            if (item) {
                // Deleta a imagem do disco
                FileHelper.deletarArquivo(item.imagem);
                // Deleta do banco
                await BannersModel.delete(id);
            }

            res.json({ message: "Banner removido." });
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao deletar banner." });
        }
    }

    static async editar(req, res) {
        const { id } = req.params;
        const { titulo, link } = req.body;

        try {
            const bannerAntigo = await BannersModel.getById(id);
            if (!bannerAntigo) return res.status(404).json({ error: "Banner não encontrado" });

            // Lógica limpa: o helper decide se usa a nova ou mantem a antiga
            const imagemFinal = FileHelper.processarImagem(req, bannerAntigo);

            await BannersModel.update(id, { titulo, link, imagem: imagemFinal });
            res.json({ message: 'Banner atualizado!' });
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar banner" });
        }
    }
}