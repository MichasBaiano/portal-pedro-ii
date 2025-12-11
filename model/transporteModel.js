import { openDb } from "../Config/db.js";

export class TransportesModel {
    static async getAll() {
        const db = await openDb();
        return db.all('SELECT * FROM transportes');
    }
}