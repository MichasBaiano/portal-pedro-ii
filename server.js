import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { MapaController } from "./controller/mapaController.js";
import { SugestaoController } from "./controller/sugestaoController.js";
import { EventosController } from "./controller/eventoController.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json()); 

app.use(express.static(path.join(__dirname, "view")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./view/templates/index.html"));
});

app.get("/perfil", (req, res) => {
  res.sendFile(path.join(__dirname, "./view/templates/perfil.html"));
});

app.get("/mapa", (req, res) => {
  res.sendFile(path.join(__dirname, "./View/templates/mapa.html"));
});

app.get("/sugestao", (req, res) => {
  res.sendFile(path.join(__dirname, "./View/templates/sugestao.html"));
});

app.get("/eventos", (req, res) => {
  res.sendFile(path.join(__dirname, "./View/templates/eventos.html"));
});

app.get("/api/pontos-mapa", MapaController.getPontosMapa);
app.post("/api/sugestao", SugestaoController.enviarSugestao);
app.get("/api/eventos", EventosController.listarEventos);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));