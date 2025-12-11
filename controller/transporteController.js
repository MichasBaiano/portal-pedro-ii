// controller/TransportesController.js
import { TransportesModel } from "../model/transporteModel.js";

export class TransportesController {
    static listar(req, res) {
        const dados = TransportesModel.getAll();
        res.json(dados);
    }
}