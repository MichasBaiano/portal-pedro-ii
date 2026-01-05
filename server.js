import 'dotenv/config'; // 1. Lê as variáveis do arquivo .env
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { inicializarBanco } from "./Config/db.js";
import session from "express-session";
import rateLimit from 'express-rate-limit';
import helmet from "helmet";
import hpp from "hpp";

// Rotas
import siteRoutes from "./routes/siteRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
// Configuração do Helmet (Permite imagens externas e scripts inline)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            // Padrão: só confia no próprio site
            defaultSrc: ["'self'"], 
            
            // Scripts: Permite 'unsafe-inline' (necessário para scripts no EJS funcionarem)
            scriptSrc: ["'self'", "'unsafe-inline'"], 
            
            // Estilos: Permite CSS inline e Google Fonts
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], 
            
            // Fontes: Permite carregar do Google Fonts
            fontSrc: ["'self'", "https://fonts.gstatic.com"], 
            
            // Imagens: Permite carregar de qualquer site HTTPS (Wikipédia, TripAdvisor, etc.) e Base64
            imgSrc: ["'self'", "data:", "https:"], 
            
            // Conexões: Permite o site falar com a própria API
            connectSrc: ["'self'"], 
            
            // Permite abrir frames se necessário
            frameSrc: ["'self'"]
        },
    },
}));
const PORT = process.env.PORT || 3000;

// --- Configurações do Express ---

// 1. View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Arquivos Estáticos (CSS, JS, Imagens)
app.use(express.static(path.join(__dirname, "public")));

// 3. Processamento de Dados (IMPORTANTE para Login e Formulários)
app.use(express.json()); // Lê JSON (usado pelos seus fetchs no front)
app.use(express.urlencoded({ extended: true })); // Lê dados de formulário tradicional
app.use(hpp()); // Evita bugs com parâmetros duplicados

// 4. Sessão de Usuário (Login)
// Verifica se estamos em produção (na internet)
const isProduction = process.env.NODE_ENV === 'production';
app.use(session({
    secret: process.env.SESSION_SECRET, // Lê do .env
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction,
        httpOnly: true, // Segurança contra roubo de cookie via JS
        maxAge: 1000 * 60 * 60 * 24, // Sessão expira em 1 dia
        sameSite: 'strict' // Evita Cross-Site Request Forgery
    }
}));

// Configura o limitador de tentativas
const limitadorLogin = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Bloqueia após 5 tentativas erradas
    message: "Muitas tentativas de login. Tente novamente em 15 minutos."
});

// Aplica APENAS na rota de login da API
app.use("/api/login", limitadorLogin);

// --- Rotas ---
app.use("/", siteRoutes); // Páginas HTML (Home, Mapa, Admin...)
app.use("/api", apiRoutes); // Dados e Ações (Salvar, Deletar...)

// Rota 404 (Para qualquer link que não exista)
app.use((req, res) => {
    // Tenta renderizar uma página 404.ejs se existir, senão manda texto
    res.status(404).send(`
        <div style="text-align:center; padding:50px; font-family:sans-serif;">
            <h1>404 - Página não encontrada</h1>
            <p>O caminho que você procurou não existe.</p>
            <a href="/">Voltar para o Início</a>
        </div>
    `);
});

// --- Inicialização ---
inicializarBanco().then(() => {
    app.listen(PORT, () => {
        console.log(`---------------------------------------------`);
        console.log(`Servidor rodando em: http://localhost:${PORT}`);
        console.log(`---------------------------------------------`);
    });
}).catch(erro => {
    console.error("Erro fatal ao iniciar o banco de dados:", erro);
});