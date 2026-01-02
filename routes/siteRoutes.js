import express from "express";
import { verificarAutenticacao } from "../Middleware/authMiddleware.js";
import { AuthController } from "../controller/authController.js";

const router = express.Router();

// --- Rotas Públicas (Renderizam EJS) ---
router.get("/", (req, res) => res.render("index"));
router.get("/perfil", (req, res) => res.render("perfil"));
router.get("/mapa", (req, res) => res.render("mapa"));
router.get("/sugestao", (req, res) => res.render("sugestao"));
router.get("/eventos", (req, res) => res.render("eventos"));
router.get("/estabelecimentos", (req, res) => res.render("estabelecimentos"));
router.get("/transportes", (req, res) => res.render("transportes"));
router.get("/detalhe", (req, res) => res.render("detalhe"));

// Rotas de Login
router.get("/login", (req, res) => res.render("login"));
router.get("/logout", AuthController.logout);

// --- Rotas Admin ---
router.get("/admin", verificarAutenticacao, (req, res) => res.render("admin-dashboard"));
router.get("/admin/eventos", verificarAutenticacao, (req, res) => res.render("admin-eventos"));
router.get("/admin/estabelecimentos", verificarAutenticacao, (req, res) => res.render("admin-estabelecimentos"));
router.get("/admin/transportes", verificarAutenticacao, (req, res) => res.render("admin-transportes"));
router.get("/admin/sugestoes", verificarAutenticacao, (req, res) => res.render("admin-sugestoes"));
router.get("/admin/banners", verificarAutenticacao, (req, res) => res.render("admin-banners"));

export default router;