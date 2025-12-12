import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { inicializarBanco } from "./Config/db.js";
import session from "express-session";

// Importando as rotas organizadas
import siteRoutes from "./routes/siteRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// 1. Middlewares Globais
app.use(express.json()); // Ler JSON do body
app.use(express.static(path.join(__dirname, "view"))); // Servir CSS/JS/Imagens

// 2. CONFIGURAÇÃO DA SESSÃO
app.use(session({
    secret: 'segredo-super-secreto-pedro-ii', // Chave para assinar a sessão
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Em produção (HTTPS) seria true, no localhost é false
}));

// 3. Usando as Rotas
app.use("/", siteRoutes); // Todas as rotas de página (HTML)
app.use("/api", apiRoutes); // Todas as rotas de API (JSON) - Adiciona o prefixo /api automaticamente

// 4. Inicialização
inicializarBanco().then(() => {
    app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
});