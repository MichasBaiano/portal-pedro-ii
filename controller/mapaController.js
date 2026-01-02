import { openDb } from "../Config/db.js";

export class MapaController {
    static async getPontosMapa(req, res) {
        try {
            const db = await openDb();
            
            // Busca Locais e Eventos
            const locais = await db.all("SELECT id, nome, categoria, latitude, longitude, imagem FROM estabelecimentos WHERE latitude IS NOT NULL");
            const eventos = await db.all("SELECT id, nome, categoria, latitude, longitude, imagem FROM eventos WHERE latitude IS NOT NULL");

            // Padroniza os dados para o mapa
            const pontosLocais = locais.map(l => ({
                id: l.id,
                titulo: l.nome,
                tipo: 'local', // Para sabermos qual link gerar
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

            // Junta tudo numa lista só
            res.json([...pontosLocais, ...pontosEventos]);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao buscar pontos do mapa." });
        }
    }
}