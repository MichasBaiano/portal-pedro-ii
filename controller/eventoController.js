import { EventosModel } from "../model/eventosModel.js";

export class EventosController {
    static async listarEventos(req, res) {
        try {
            const eventos = await EventosModel.getAll();
            res.json(eventos);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao buscar eventos." });
        }
    }
}