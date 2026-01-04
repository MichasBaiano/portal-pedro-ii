import { EstabelecimentosModel } from "../model/estabelecimentoModel.js";
import { openDb } from "../Config/db.js";

export class MapaController {
    static async getPontosMapa(req, res) {
        try {
            // 1. Busca Locais via Model
            const locais = await EstabelecimentosModel.getComCoordenadas();
            
            // 2. Busca Eventos (Como é simples, mantive o SQL aqui, mas idealmente iria pro EventosModel)
            const db = await openDb();
            const eventos = await db.all("SELECT id, nome, categoria, latitude, longitude, imagem FROM eventos WHERE latitude IS NOT NULL");

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

            res.json([...pontosLocais, ...pontosEventos]);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao buscar pontos do mapa." });
        }
    }
}