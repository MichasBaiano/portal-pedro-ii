import { EventosModel } from "../model/eventosModel.js";

export class EventosController {
    // GET: Listar todos
    static async listarEventos(req, res) {
        try {
            const busca = req.query.q; // Pega o ?q= da URL
            
            if (busca) {
                const resultados = await EventosModel.search(busca);
                res.json(resultados);
            } else {
                const eventos = await EventosModel.getAll();
                res.json(eventos);
            }
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao buscar eventos." });
        }
    }

    // POST: Criar novo
static async criarEvento(req, res) {
        try {
            let dados = req.body;
            
            // Lógica de Imagem: Se veio arquivo, cria o caminho relativo
            if (req.file) {
                dados.imagem = '/uploads/' + req.file.filename;
            }

            const novoEvento = await EventosModel.create(dados);
            res.status(201).json(novoEvento);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao criar evento." });
        }
    }

    // PUT: Editar existente
static async editarEvento(req, res) {
        try {
            const id = req.params.id;
            let dados = req.body;

            // Se o usuário enviou uma nova foto, atualiza.
            if (req.file) {
                dados.imagem = '/uploads/' + req.file.filename;
            }
            // Se não enviou arquivo, o 'dados.imagem' continua sendo a URL antiga que virá do form hidden

            const eventoAtualizado = await EventosModel.update(id, dados);
            res.json(eventoAtualizado);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao atualizar evento." });
        }
    }

    // DELETE: Apagar
    static async deletarEvento(req, res) {
        try {
            const id = req.params.id;
            await EventosModel.delete(id);
            res.json({ mensagem: "Evento deletado!" });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao deletar evento." });
        }
    }

    static async getEvento(req, res) {
        try {
            const evento = await EventosModel.getById(req.params.id);
            if(evento) res.json(evento);
            else res.status(404).json({erro: "Não encontrado"});
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao buscar evento." });
        }
    }
}