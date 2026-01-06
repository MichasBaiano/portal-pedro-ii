import { BannersModel } from "../model/bannersModel.js";

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
        const { titulo, link, imagemUrl } = req.body; // imagemUrl vem do hidden input
        
        try {
            const db = await openDb();
            
            // Se fez upload, usa a nova. Se não, usa a antiga (URL)
            let imagemFinal = req.file ? `/uploads/${req.file.filename}` : imagemUrl;

            await db.run(
                `UPDATE banners SET titulo=?, link=?, imagem=? WHERE id=?`,
                [titulo, link, imagemFinal, id]
            );

            res.json({ message: 'Banner atualizado!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}