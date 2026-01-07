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

const router = express.Router();

// ======================================================
//      ROTAS PÚBLICAS (Qualquer um pode acessar)
// ======================================================

// Login e Mapa
router.post("/login", AuthController.login);
router.get("/pontos-mapa", MapaController.getPontosMapa);

// Sugestões
router.post("/sugestoes", SugestaoController.enviarSugestao);

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
router.post("/avaliacoes", AvaliacaoController.adicionar);


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
router.post("/estabelecimentos", verificarAutenticacao, upload.single('imagem'),  EstabelecimentosController.criar);
router.put("/estabelecimentos/:id", verificarAutenticacao, upload.single('imagem'), EstabelecimentosController.editar);
router.delete("/estabelecimentos/:id", verificarAutenticacao, EstabelecimentosController.deletar);
// Rota especial para ligar/desligar destaque (PATCH pois é uma atualização parcial)
router.patch("/estabelecimentos/:id/destaque", verificarAutenticacao, EstabelecimentosController.alternarDestaque);

// Transportes (Criar, Editar, Deletar)
router.post("/transportes", verificarAutenticacao, TransportesController.criar);
router.put("/transportes/:id", verificarAutenticacao, TransportesController.editar);
router.delete("/transportes/:id", verificarAutenticacao, TransportesController.deletar);

// Banners (Criar, Editar, Deletar)
router.post("/banners", verificarAutenticacao, upload.single('imagem'), BannersController.criar);
router.put("/banners/:id", verificarAutenticacao, upload.single('imagem'), BannersController.editar);
router.delete("/banners/:id", verificarAutenticacao, BannersController.deletar);

export default router;