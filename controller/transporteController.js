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

    static async criar(req, res) {
        try {
            const novo = await TransportesModel.create(req.body);
            res.status(201).json(novo);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao criar transporte." });
        }
    }

    static async editar(req, res) {
        try {
            const id = req.params.id;
            const atualizado = await TransportesModel.update(id, req.body);
            res.json(atualizado);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao atualizar transporte." });
        }
    }

    static async deletar(req, res) {
        try {
            const id = req.params.id;
            await TransportesModel.delete(id);
            res.json({ mensagem: "Transporte deletado!" });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao deletar transporte." });
        }
    }
}