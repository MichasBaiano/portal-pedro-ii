import express from "express";
import { upload } from "../config/upload.js";
import { verificarAutenticacao } from "../middlewares/authMiddleware.js";

// Controllers
import { MapaController } from "../controllers/mapaController.js";
import { SugestaoController } from "../controllers/sugestaoController.js";
import { EventosController } from "../controllers/eventoController.js";
import { EstabelecimentosController } from "../controllers/estabelecimentoController.js";
import { TransportesController } from "../controllers/transporteController.js";
import { AuthController } from "../controllers/authController.js";
import { BannersController } from "../controllers/bannersController.js";
import { DashboardController } from "../controllers/dashboardController.js";
import { AvaliacaoController } from "../controllers/avaliacaoController.js";
import { eventoValidator } from "../validators/eventoValidator.js";
import { sugestaoValidator } from "../validators/sugestaoValidator.js";
import { estabelecimentoValidator } from "../validators/estabelecimentoValidator.js";
import { transporteValidator } from "../validators/transporteValidator.js";
import { bannerValidator } from "../validators/bannerValidator.js";
import { avaliacaoValidator } from "../validators/avaliacaoValidator.js";

const router = express.Router();

// ======================================================
//      ROTAS PÚBLICAS (Qualquer um pode acessar)
// ======================================================

// Login e Mapa
router.post("/login", AuthController.login);
router.get("/pontos-mapa", MapaController.getPontosMapa);

// Sugestões
router.post("/sugestoes", sugestaoValidator, SugestaoController.enviarSugestao);

/**
 * @swagger
 * {
 * "components": {
 * "schemas": {
 * "Evento": {
 * "type": "object",
 * "required": ["nome", "data", "local"],
 * "properties": {
 * "id": { "type": "integer", "description": "ID gerado automaticamente" },
 * "nome": { "type": "string", "description": "Nome do evento" },
 * "data": { "type": "string", "format": "date", "description": "Data do evento (YYYY-MM-DD)" },
 * "local": { "type": "string", "description": "Localização do evento" },
 * "imagem": { "type": "string", "description": "Caminho da imagem" }
 * },
 * "example": {
 * "nome": "Festival de Inverno",
 * "data": "2025-06-15",
 * "local": "Praça da Bonelle"
 * }
 * }
 * }
 * }
 * }
 */

/**
 * @swagger
 * {
 * "/eventos": {
 * "get": {
 * "summary": "Lista todos os eventos (com paginação)",
 * "tags": ["Eventos"],
 * "parameters": [
 * {
 * "in": "query",
 * "name": "pagina",
 * "schema": { "type": "integer" },
 * "description": "Número da página (padrão 1)"
 * },
 * {
 * "in": "query",
 * "name": "limite",
 * "schema": { "type": "integer" },
 * "description": "Itens por página (padrão 6)"
 * },
 * {
 * "in": "query",
 * "name": "q",
 * "schema": { "type": "string" },
 * "description": "Termo de busca"
 * }
 * ],
 * "responses": {
 * "200": {
 * "description": "Lista de eventos retornada com sucesso",
 * "content": {
 * "application/json": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "dados": {
 * "type": "array",
 * "items": { "$ref": "#/components/schemas/Evento" }
 * },
 * "meta": {
 * "type": "object",
 * "properties": {
 * "totalPaginas": { "type": "integer" },
 * "totalItens": { "type": "integer" }
 * }
 * }
 * }
 * }
 * }
 * }
 * }
 * }
 * }
 * }
 * }
 */

// Leitura de Eventos
router.get("/eventos", EventosController.listarEventos);
router.get("/eventos/:id", EventosController.getEvento);

// Leitura de Estabelecimentos
router.get("/estabelecimentos", EstabelecimentosController.listar);
router.get("/estabelecimentos/:id", EstabelecimentosController.getEstabelecimento);

// Leitura de Transportes
router.get("/transportes", TransportesController.listar);

// Leitura de Banners
router.get("/banners", BannersController.listar);

// --- AVALIAÇÕES ---
router.get("/avaliacoes/:tipo/:id", AvaliacaoController.listar);
router.post("/avaliacoes", avaliacaoValidator, AvaliacaoController.adicionar);


// ======================================================
//       ROTAS RESTRITAS (Só Admin logado acessa)
// ======================================================

// Dashboard (Estatísticas)
router.get("/dashboard/stats", verificarAutenticacao, DashboardController.getStats);

// Sugestões (Ler e Deletar)
router.get("/sugestoes", verificarAutenticacao, SugestaoController.listar);
router.delete("/sugestoes/:id", verificarAutenticacao, SugestaoController.deletar);

// Eventos (Criar, Editar, Deletar)
router.post("/eventos", verificarAutenticacao, upload.single('imagem'), eventoValidator, EventosController.criarEvento);
router.put("/eventos/:id", verificarAutenticacao, upload.single('imagem'), eventoValidator, EventosController.editarEvento);
router.delete("/eventos/:id", verificarAutenticacao, EventosController.deletarEvento);

// Estabelecimentos (Criar, Editar, Deletar)
router.post("/estabelecimentos", verificarAutenticacao, upload.single('imagem'), estabelecimentoValidator, EstabelecimentosController.criar);
router.put("/estabelecimentos/:id", verificarAutenticacao, upload.single('imagem'), estabelecimentoValidator, EstabelecimentosController.editar);
router.delete("/estabelecimentos/:id", verificarAutenticacao, EstabelecimentosController.deletar);
// Rota especial para ligar/desligar destaque (PATCH pois é uma atualização parcial)
router.patch("/estabelecimentos/:id/destaque", verificarAutenticacao, EstabelecimentosController.alternarDestaque);

// Transportes (Criar, Editar, Deletar)
router.post("/transportes", verificarAutenticacao, transporteValidator, TransportesController.criar);
router.put("/transportes/:id", verificarAutenticacao, transporteValidator, TransportesController.editar);
router.delete("/transportes/:id", verificarAutenticacao, TransportesController.deletar);

// Banners (Criar, Editar, Deletar)
router.post("/banners", verificarAutenticacao, upload.single('imagem'), bannerValidator, BannersController.criar);
router.put("/banners/:id", verificarAutenticacao, upload.single('imagem'), bannerValidator, BannersController.editar);
router.delete("/banners/:id", verificarAutenticacao, BannersController.deletar);

export default router;