import { EventosModel } from "../models/eventosModel.js";
import { EstabelecimentosModel } from "../models/estabelecimentoModel.js";
import { BannersModel } from "../models/bannersModel.js";

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