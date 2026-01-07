// model/usuarioModel.js
import { openDb } from "../Config/db.js";

export class UsuarioModel {
    static async buscarPorLogin(login) {
        const db = await openDb();
        return db.get('SELECT * FROM usuarios WHERE login = ?', [login]);
    }
}