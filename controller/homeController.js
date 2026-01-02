import { openDb } from "../Config/db.js";

export class HomeController {
    static async index(req, res) {
        try {
            const db = await openDb();

            // 1. Busca os próximos 3 eventos (Data maior ou igual a hoje)
            const eventos = await db.all(`
                SELECT * FROM eventos 
                WHERE data >= date('now') 
                ORDER BY data ASC 
                LIMIT 3
            `);

            // 2. Busca os 3 locais marcados como destaque (aleatórios para dar chance a todos)
            const destaques = await db.all(`
                SELECT * FROM estabelecimentos 
                WHERE destaque = 1 
                ORDER BY RANDOM() 
                LIMIT 3
            `);

            // Renderiza a home enviando esses dados
            res.render("index", { 
                eventos, 
                destaques 
            });

        } catch (erro) {
            console.error("Erro na Home:", erro);
            // Se der erro, renderiza sem dados para não quebrar o site
            res.render("index", { eventos: [], destaques: [] });
        }
    }
}