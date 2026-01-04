import { EventosModel } from "../model/eventosModel.js";
import { EstabelecimentosModel } from "../model/estabelecimentoModel.js";

export class HomeController {
    static async index(req, res) {
        try {
            const eventos = await EventosModel.getProximos(3);
            const destaques = await EstabelecimentosModel.getDestaques(3);

            res.render("index", { 
                eventos, 
                destaques 
            });

        } catch (erro) {
            console.error("Erro na Home:", erro);
            res.render("index", { eventos: [], destaques: [] });
        }
    }
}