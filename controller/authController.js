import { UsuarioModel } from "../model/usuarioModel.js";

export class AuthController {
    static async login(req, res) {
        const { login, senha } = req.body;

        try {
            const usuario = await UsuarioModel.buscarPorLogin(login);

            if (usuario && usuario.senha === senha) {
                // SUCESSO: Salva o usuário na sessão do servidor
                req.session.usuarioLogado = { id: usuario.id, login: usuario.login };
                
                res.json({ sucesso: true, mensagem: "Login realizado!" });
            } else {
                res.status(401).json({ sucesso: false, erro: "Usuário ou senha incorretos." });
            }
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro interno." });
        }
    }

    // Função para Sair
    static logout(req, res) {
        req.session.destroy(); // Apaga a sessão
        res.redirect('/login'); // Manda de volta pra tela de login
    }
}