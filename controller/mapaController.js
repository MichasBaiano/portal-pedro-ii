// controller/MapaController.js
import { LocaisModel } from "../model/LocaisModel.js";

export class MapaController {
    static getPontosMapa(req, res) {
        const pontos = LocaisModel.getAll();
        res.json(pontos);
    }
}