import { EstabelecimentosModel } from "../models/estabelecimentoModel.js";
import { EventosModel } from "../models/eventosModel.js";

export class MapaController {
    static async getPontosMapa(req, res) {
        try {
            // 1. Busca Locais via Model
            const locais = await EstabelecimentosModel.getComCoordenadas();
            const eventos = await EventosModel.getComCoordenadas();
            
            // Padroniza os dados
            const pontosLocais = locais.map(l => ({
                id: l.id,
                titulo: l.nome,
                tipo: 'local',
                categoria: l.categoria,
                lat: l.latitude,
                lng: l.longitude,
                img: l.imagem
            }));

            const pontosEventos = eventos.map(e => ({
                id: e.id,
                titulo: e.nome,
                tipo: 'evento',
                categoria: 'Evento',
                lat: e.latitude,
                lng: e.longitude,
                img: e.imagem
            }));

            // Junta tudo num array só
            res.json([...pontosLocais, ...pontosEventos]);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao buscar pontos do mapa." });
        }
    }
}