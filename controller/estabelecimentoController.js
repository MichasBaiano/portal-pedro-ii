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

    static async criar(req, res) {
        try {
            const novo = await EstabelecimentosModel.create(req.body);
            res.status(201).json(novo);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao criar local." });
        }
    }

    static async editar(req, res) {
        try {
            const id = req.params.id;
            const atualizado = await EstabelecimentosModel.update(id, req.body);
            res.json(atualizado);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao atualizar local." });
        }
    }

    static async deletar(req, res) {
        try {
            const id = req.params.id;
            await EstabelecimentosModel.delete(id);
            res.json({ mensagem: "Local deletado!" });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao deletar local." });
        }
    }
}