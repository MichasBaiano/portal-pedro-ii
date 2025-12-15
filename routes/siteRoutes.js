import express from "express";
import path from "path";
import { fileURLToPath } from "url";
// 1. Importe o Middleware e o Controller de Auth
import { verificarAutenticacao } from "../Middleware/authMiddleware.js";
import { AuthController } from "../controller/authController.js";

const router = express.Router();

// Configuração do __dirname (necessário pois estamos em outra pasta)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ajuste do caminho para voltar uma pasta (..) e entrar na View
const viewPath = path.join(__dirname, "../View/templates");

// --- Rotas Públicas ---
router.get("/", (req, res) => res.sendFile(path.join(viewPath, "index.html")));
router.get("/perfil", (req, res) => res.sendFile(path.join(viewPath, "perfil.html")));
router.get("/mapa", (req, res) => res.sendFile(path.join(viewPath, "mapa.html")));
router.get("/sugestao", (req, res) => res.sendFile(path.join(viewPath, "sugestao.html")));
router.get("/eventos", (req, res) => res.sendFile(path.join(viewPath, "eventos.html")));
router.get("/estabelecimentos", (req, res) => res.sendFile(path.join(viewPath, "estabelecimentos.html")));
router.get("/transportes", (req, res) => res.sendFile(path.join(viewPath, "transportes.html")));
router.get("/detalhe", (req, res) => res.sendFile(path.join(viewPath, "detalhe.html")));

// Rotas de Login e Logout
router.get("/login", (req, res) => res.sendFile(path.join(viewPath, "login.html")));
router.get("/logout", AuthController.logout); // Rota para sair

// --- Rotas Admin ---
router.get("/admin/eventos", verificarAutenticacao, (req, res) => res.sendFile(path.join(viewPath, "admin-eventos.html")));
router.get("/admin/estabelecimentos", verificarAutenticacao, (req, res) => res.sendFile(path.join(viewPath, "admin-estabelecimentos.html")));
router.get("/admin/transportes", verificarAutenticacao, (req, res) => res.sendFile(path.join(viewPath, "admin-transportes.html")));
router.get("/admin/sugestoes", verificarAutenticacao, (req, res) => res.sendFile(path.join(viewPath, "admin-sugestoes.html")));

// rotas banners
router.get("/admin/banners", verificarAutenticacao, (req, res) => res.sendFile(path.join(viewPath, "admin-banners.html")));
export default router;