import { openDb } from "../Config/db.js";

export class SugestaoModel {
    // Agora os métodos são ASYNC porque banco de dados leva tempo
    static async salvar(dados) {
        const db = await openDb();
        
        const resultado = await db.run(
            `INSERT INTO sugestoes (tipo, nome, email, mensagem) VALUES (?, ?, ?, ?)`,
            [dados.tipo, dados.nome, dados.email, dados.mensagem]
        );
        
        return { id: resultado.lastID, ...dados };
    }

    static async listarTodas() {
        const db = await openDb();
        // Busca tudo da tabela
        return db.all('SELECT * FROM sugestoes');
    }
}