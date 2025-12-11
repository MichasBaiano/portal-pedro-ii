import { openDb } from "../Config/db.js";

export class EventosModel {
    static async getAll() {
        const db = await openDb();
        return db.all('SELECT * FROM eventos');
    }
}