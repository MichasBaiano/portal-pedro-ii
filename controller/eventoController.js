// controller/EventosController.js
import { EventosModel } from "../model/eventosModel.js";

export class EventosController {
    static listarEventos(req, res) {
        const eventos = EventosModel.getAll();
        res.json(eventos);
    }
}