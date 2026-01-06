import 'dotenv/config'; // 1. Lê as variáveis do arquivo .env
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { inicializarBanco } from "./config/db.js";
import session from "express-session";
import rateLimit from 'express-rate-limit';
import helmet from "helmet";
import hpp from "hpp";

// Rotas
import siteRoutes from "./routes/siteRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.set('trust proxy', 1);
// Configuração do Helmet (Blindagem de Segurança)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            // Padrão: só confia no próprio site
            defaultSrc: ["'self'"], 
            
            // Scripts: Permite scripts do próprio site, inline, E DE SITES EXTERNOS (HTTPS)
            // Isso conserta o Leaflet/Mapas que vem de fora
            scriptSrc: ["'self'", "'unsafe-inline'", "https:"], 
            
            // Estilos: Permite CSS do próprio site, inline, Google Fonts E EXTERNOS (HTTPS)
            // Isso conserta o CSS do Leaflet
            styleSrc: ["'self'", "'unsafe-inline'", "https:", "https://fonts.googleapis.com"], 
            
            // Fontes: Permite carregar do Google Fonts e outros https
            fontSrc: ["'self'", "https:", "data:", "https://fonts.gstatic.com"], 
            
            // Imagens: Permite carregar de qualquer site HTTPS e Base64
            imgSrc: ["'self'", "data:", "https:"], 
            
            // Conexões: Permite o site falar com a própria API e serviços externos seguros
            connectSrc: ["'self'", "https:"], 
            
            // Permite abrir frames se necessário
            frameSrc: ["'self'"],

            // Impede que outros sites coloquem o seu em um iframe (Clickjacking)
            frameAncestors: ["'self'"]
        },
    },
    // Garante o header antigo X-Frame-Options também
    xFrameOptions: { action: "deny" }
}));
const PORT = process.env.PORT || 3000;

// --- Configurações do Express ---

// 1. View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Arquivos Estáticos (CSS, JS, Imagens)
app.use(express.static(path.join(__dirname, "public")));

// 3. Processamento de Dados (IMPORTANTE para Login e Formulários)
app.use(express.json({ limit: '100kb' })); // Lê JSON até 100kb (usado pelos seus fetchs no front)
app.use(express.urlencoded({ extended: true, limit: '100kb' })); // Lê dados de formulário tradicional até 100kb
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
// A ordem de chamadas deve sempre ser essa
app.use("/api", apiRoutes); // Dados e Ações (Salvar, Deletar...)
app.use("/", siteRoutes); // Páginas HTML (Home, Mapa, Admin...)


// Middleware de Tratamento de Erros (Erro 500)
app.use((err, req, res, next) => {
    console.error("ERRO CRÍTICO:", err.stack); // Mostra o erro real no terminal

    // VERIFICAÇÃO INTELIGENTE:
    // Se a URL começa com "/api", OU se o navegador pediu JSON...
    if (req.url.startsWith('/api') || req.headers.accept.indexOf('json') > -1) {
        // ...então responda com JSON para não quebrar o front-end
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }

    // Se for acesso normal (página inteira), mostra a view bonita
    res.status(500).render("500");
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