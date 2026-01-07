import { EventosModel } from "../models/eventosModel.js";
import { FileHelper } from "../utils/fileHelper.js";


export class EventosController {
    // GET: Listar todos
    static async listarEventos(req, res) {
        try {
            const busca = req.query.q;
            const resultados = busca ? await EventosModel.search(busca) : await EventosModel.getAll();
            res.json(resultados);
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao buscar eventos." });
        }
    }

    // POST: Criar novo
    static async criarEvento(req, res) {
        try {
            let dados = req.body;
            dados.imagem = FileHelper.processarImagem(req, null);
            // a ser corrigido
            dados.latitude = dados.latitude ? parseFloat(dados.latitude) : null;
            dados.longitude = dados.longitude ? parseFloat(dados.longitude) : null;

            const novoEvento = await EventosModel.create(dados);
            res.status(201).json(novoEvento);
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao criar evento." });
        }
    }

    // PUT: Editar existente
    static async editarEvento(req, res) {
        try {
            const id = req.params.id;
            const eventoAntigo = await EventosModel.getById(id);

            if (!eventoAntigo) return res.status(404).json({ erro: "Evento não encontrado" });

            // Mescla dados do body com a lógica de imagem
            const dados = {
                ...req.body,
                imagem: FileHelper.processarImagem(req, eventoAntigo)
            };

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
            const item = await EventosModel.getById(id);
            if (item) {
                FileHelper.deletarArquivo(item.imagem); // Limpa disco
                await EventosModel.delete(id); // Limpa banco
            }
            res.json({ mensagem: "Evento deletado!" });
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao deletar evento." });
        }
    }

    static async getEvento(req, res) {
        try {
            const evento = await EventosModel.getById(req.params.id);
            if (evento) res.json(evento);
            else res.status(404).json({ erro: "Não encontrado" });
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao buscar evento." });
        }
    }
}