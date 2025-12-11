import { EventosModel } from "../model/eventosModel.js";

export class EventosController {
    // GET: Listar todos
    static async listarEventos(req, res) {
        try {
            const eventos = await EventosModel.getAll();
            res.json(eventos);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao buscar eventos." });
        }
    }

    // POST: Criar novo
    static async criarEvento(req, res) {
        console.log("Dados recebidos:", req.body); // Log para debug

        try {
            const novoEvento = await EventosModel.create(req.body);
            res.status(201).json(novoEvento);
        } catch (erro) {
            console.error("Erro no Controller:", erro);
            res.status(500).json({ erro: "Erro ao criar evento." });
        }
    } // <--- AQUI ESTAVA O ERRO (tinha duas chaves }})

    // PUT: Editar existente
    static async editarEvento(req, res) {
        try {
            const id = req.params.id;
            const eventoAtualizado = await EventosModel.update(id, req.body);
            res.json(eventoAtualizado);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao atualizar evento." });
        }
    }

    // DELETE: Apagar
    static async deletarEvento(req, res) {
        try {
            const id = req.params.id;
            await EventosModel.delete(id);
            res.json({ mensagem: "Evento deletado!" });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao deletar evento." });
        }
    }
}