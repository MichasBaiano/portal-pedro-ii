import { EventosModel } from "../model/eventosModel.js";
import { EstabelecimentosModel } from "../model/estabelecimentoModel.js";
import { BannersModel } from "../model/bannersModel.js";

export class HomeController {
    static async index(req, res) {
        try {
            const eventos = await EventosModel.getProximos(3);
            const destaques = await EstabelecimentosModel.getDestaques(3);
            const banners = await BannersModel.getAll();

            res.render("index", { 
                eventos, 
                destaques,
                banners
            });

        } catch (erro) {
            console.error("Erro na Home:", erro);
            res.render("index", { eventos: [], destaques: [], banners: [] });
        }
    }
}