import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { inicializarBanco } from "./Config/db.js";
import { MapaController } from "./controller/mapaController.js";
import { SugestaoController } from "./controller/sugestaoController.js";
import { EventosController } from "./controller/eventoController.js";
import { EstabelecimentosController } from "./controller/estabelecimentoController.js";
import { TransportesController } from "./controller/transporteController.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// 1. Middleware JSON (Essencial para receber dados do formulário)
app.use(express.json()); 

app.use(express.static(path.join(__dirname, "view"))); // Notei que sua pasta view está minúscula no Windows

// --- Rotas de Páginas (HTML) ---
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "./view/templates/index.html")));
app.get("/perfil", (req, res) => res.sendFile(path.join(__dirname, "./view/templates/perfil.html")));
app.get("/mapa", (req, res) => res.sendFile(path.join(__dirname, "./view/templates/mapa.html"))); // Verifique se a pasta é 'View' ou 'view'
app.get("/sugestao", (req, res) => res.sendFile(path.join(__dirname, "./view/templates/sugestao.html")));
app.get("/eventos", (req, res) => res.sendFile(path.join(__dirname, "./view/templates/eventos.html")));
app.get("/estabelecimentos", (req, res) => res.sendFile(path.join(__dirname, "./view/templates/estabelecimentos.html")));
app.get("/transportes", (req, res) => res.sendFile(path.join(__dirname, "./view/templates/transportes.html")));

// --- Rotas da API (Dados) ---
app.get("/api/pontos-mapa", MapaController.getPontosMapa);
app.post("/api/sugestao", SugestaoController.enviarSugestao);

app.get("/api/estabelecimentos", EstabelecimentosController.listar);
app.get("/api/transportes", TransportesController.listar);

// --- CRUD DE EVENTOS (Adicionado) ---
app.get("/api/eventos", EventosController.listarEventos);      // Ler
app.post("/api/eventos", EventosController.criarEvento);       // Criar (Faltava essa)
app.put("/api/eventos/:id", EventosController.editarEvento);   // Editar (Faltava essa)
app.delete("/api/eventos/:id", EventosController.deletarEvento); // Deletar (Faltava essa)

// --- CRUD ESTABELECIMENTOS ---
app.get("/api/estabelecimentos", EstabelecimentosController.listar);
app.post("/api/estabelecimentos", EstabelecimentosController.criar);
app.put("/api/estabelecimentos/:id", EstabelecimentosController.editar);
app.delete("/api/estabelecimentos/:id", EstabelecimentosController.deletar);

// --- CRUD TRANSPORTES ---
app.get("/api/transportes", TransportesController.listar);
app.post("/api/transportes", TransportesController.criar);
app.put("/api/transportes/:id", TransportesController.editar);
app.delete("/api/transportes/:id", TransportesController.deletar);

// --- NOVAS ROTAS DE ADMIN (HTML) ---
app.get("/admin/eventos", (req, res) => {
  res.sendFile(path.join(__dirname, "./view/templates/admin-eventos.html"));
});

app.get("/admin/estabelecimentos", (req, res) => {
  res.sendFile(path.join(__dirname, "./view/templates/admin-estabelecimentos.html"));
});

app.get("/admin/transportes", (req, res) => {
  res.sendFile(path.join(__dirname, "./view/templates/admin-transportes.html"));
});

const PORT = 3000;
inicializarBanco().then(() => {
    app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
});