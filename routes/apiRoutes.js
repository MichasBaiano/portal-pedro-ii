import express from "express";

import { upload } from "../Config/upload.js";

import { MapaController } from "../controller/mapaController.js";
import { SugestaoController } from "../controller/sugestaoController.js";
import { EventosController } from "../controller/eventoController.js";
import { EstabelecimentosController } from "../controller/estabelecimentoController.js";
import { TransportesController } from "../controller/transporteController.js";
import { AuthController } from "../controller/authController.js";
import { BannersController } from "../controller/bannersController.js";

const router = express.Router();

// --- Mapa ---
router.get("/pontos-mapa", MapaController.getPontosMapa);

// --- SUGESTÕES ---
router.post("/sugestao", SugestaoController.enviarSugestao); // Já existia (Público)
router.get("/sugestoes", SugestaoController.listar);         // Novo (Admin)
router.delete("/sugestoes/:id", SugestaoController.deletar); // Novo (Admin)

// --- CRUD Eventos ---
router.get("/eventos", EventosController.listarEventos);
router.post("/eventos", upload.single('imagem'), EventosController.criarEvento);
router.put("/eventos/:id", upload.single('imagem'), EventosController.editarEvento);
router.delete("/eventos/:id", EventosController.deletarEvento);
router.get("/eventos/:id", EventosController.getEvento);

// --- CRUD Estabelecimentos ---
router.get("/estabelecimentos", EstabelecimentosController.listar);
router.post("/estabelecimentos", upload.single('imagem'),  EstabelecimentosController.criar);
router.put("/estabelecimentos/:id", upload.single('imagem'), EstabelecimentosController.editar);
router.delete("/estabelecimentos/:id", EstabelecimentosController.deletar);
router.get("/estabelecimentos/:id", EstabelecimentosController.getEstabelecimento);

// --- CRUD Transportes ---
router.get("/transportes", TransportesController.listar);
router.post("/transportes", TransportesController.criar);
router.put("/transportes/:id", TransportesController.editar);
router.delete("/transportes/:id", TransportesController.deletar);

// Admin
router.post("/login", AuthController.login);

// --- PUBLICIDADE (BANNERS) ---
router.get("/banners", BannersController.listar);
router.post("/banners", upload.single('imagem'), BannersController.criar);
router.delete("/banners/:id", BannersController.deletar);

export default router;