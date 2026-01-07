import { TransportesModel } from "../models/transporteModel.js";

export class TransportesController {
    static async listar(req, res) {
        try {
            const busca = req.query.q;

            // Busca simples
            if (busca) {
                const resultados = await TransportesModel.search(busca);
                return res.json({
                    dados: resultados,
                    meta: { total: resultados.length, pagina: 1, totalPaginas: 1 }
                });
            }

            // Paginação
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10; // cabe mais (10)
            const offset = (pagina - 1) * limite;

            const lista = await TransportesModel.getAll(limite, offset);
            const totalItens = await TransportesModel.countTotal();
            const totalPaginas = Math.ceil(totalItens / limite);

            res.json({
                dados: lista,
                meta: {
                    totalItens,
                    totalPaginas,
                    paginaAtual: pagina,
                    itensPorPagina: limite
                }
            });

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