import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { inicializarBanco } from "./Config/db.js";
import session from "express-session";

// Importando as rotas
import siteRoutes from "./routes/siteRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Configurar EJS (O NOVO MOTOR)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Arquivos Estáticos (CSS, JS, Imagens)
// Agora apontamos para a pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'segredo-super-secreto-pedro-ii',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// 3. Rotas
app.use("/", siteRoutes);
app.use("/api", apiRoutes);

// Rota de Erro 404 (Renderizando EJS se existir, senão texto simples)
app.use((req, res) => {
    res.status(404).send("<h1>404 - Página não encontrada</h1>"); 
});

// 4. Inicialização
inicializarBanco().then(() => {
    app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
});