import { UsuarioModel } from "../model/usuarioModel.js";
import bcrypt from 'bcrypt';

export class AuthController {
    static async login(req, res) {
        const { login, senha } = req.body;

        try {
            // Busca o usuário pelo login
            const usuario = await UsuarioModel.buscarPorLogin(login);

            // CORREÇÃO: Compara a senha enviada com o Hash criptografado do banco
            if (usuario && await bcrypt.compare(senha, usuario.senha)) {
                
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