import { UsuarioModel } from "../model/usuarioModel.js";

export class AuthController {
    static async login(req, res) {
        // Recebe 'login' (usuário) 
        const { login, senha } = req.body;

        try {
            // Busca no banco pelo campo 'login'
            const usuario = await UsuarioModel.buscarPorLogin(login);

            // Verifica se achou e se a senha bate
            if (usuario && usuario.senha === senha) {
                
                // Salva na sessão
                req.session.usuarioLogado = { 
                    id: usuario.id, 
                    login: usuario.login 
                };
                
                res.json({ sucesso: true, mensagem: "Login realizado!" });
            } else {
                res.status(401).json({ sucesso: false, erro: "Usuário ou senha incorretos." });
            }
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro interno no servidor." });
        }
    }

    static logout(req, res) {
        req.session.destroy();
        res.redirect('/login');
    }
}