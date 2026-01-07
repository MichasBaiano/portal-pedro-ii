import { BannersModel } from "../models/bannersModel.js";

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

            // Obrigatório ter imagem
            if (req.file) {
                dados.imagem = '/uploads/' + req.file.filename;
            } else {
                return res.status(400).json({ erro: "Imagem é obrigatória para banner." });
            }

            const novo = await BannersModel.create(dados);
            res.status(201).json(novo);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao criar banner." });
        }
    }

    static async deletar(req, res) {
        try {
            await BannersModel.delete(req.params.id);
            res.json({ message: "Banner removido." });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao deletar banner." });
        }
    }

    static async editar(req, res) {
        const { id } = req.params;
        const { titulo, link } = req.body; 

        try {
            let imagemFinal;

            // Lógica de Segurança para Imagem
            if (req.file) {
                // Usuário subiu imagem nova -> Usa ela
                imagemFinal = `/uploads/${req.file.filename}`;
            } else {
                // Não subiu imagem -> Busca a antiga no banco
                const bannerAntigo = await BannersModel.getById(id);
                if (!bannerAntigo) return res.status(404).json({ error: "Banner não encontrado" });
                imagemFinal = bannerAntigo.imagem;
            }

            // Chama o Model para atualizar
            await BannersModel.update(id, { titulo, link, imagem: imagemFinal });

            res.json({ message: 'Banner atualizado!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}