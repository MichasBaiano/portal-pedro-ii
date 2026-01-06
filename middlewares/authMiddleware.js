// Middleware/authMiddleware.js
export function verificarAutenticacao(req, res, next) {
    // Verifica se existe um usuário salvo na sessão
    if (req.session.usuarioLogado) {
        next(); // Pode passar, está logado!
    } else {
        res.redirect('/login'); // Barrado! Vai pro login.
    }
}