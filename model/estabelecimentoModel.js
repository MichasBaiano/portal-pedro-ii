import { openDb } from "../Config/db.js";

export class EstabelecimentosModel {
    static async getAll() {
        const db = await openDb();
        return db.all('SELECT * FROM estabelecimentos');
    }
}