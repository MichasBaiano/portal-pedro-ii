import { openDb } from "./config/db.js";
import bcrypt from "bcrypt";

const criarAdmin = async () => {
    const db = await openDb();
    
    // 1. Defina seus dados de acesso aqui
    const login = "admin";
    const senha = "123"; // Mude para uma senha forte depois!

    // 2. Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    try {
        console.log("Tentando criar usuário admin...");

        // Verifica se é Postgres (usa pool.query) ou SQLite
        // Seu db.js usa um wrapper, então 'run' funciona para ambos, mas a query muda ligeiramente
        // Vou usar o padrão genérico que funciona no seu wrapper
        
        await db.run(
            `INSERT INTO usuarios (login, senha) VALUES ($1, $2)`,
            [login, senhaHash]
        );

        console.log(`✅ Sucesso! Usuário '${login}' criado.`);
    } catch (erro) {
        console.error("❌ Erro ao criar admin. Talvez o login já exista?", erro);
    }
};

criarAdmin();