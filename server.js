import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { MapaController } from "./controller/MapaController.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

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

app.get("/api/pontos-mapa", MapaController.getPontosMapa);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));