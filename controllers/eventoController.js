import { EventosModel } from "../models/eventosModel.js";
import { FileHelper } from "../utils/fileHelper.js";


export class EventosController {
    // GET: Listar por páginas
    static async listarEventos(req, res) {
        try {
            const busca = req.query.q;

            // Se for busca, mantém simples por enquanto
            if (busca) {
                const resultados = await EventosModel.search(busca);
                // Retorna no mesmo formato padronizado para não confundir o front
                return res.json({
                    dados: resultados,
                    meta: { totalItens: resultados.length, pagina: 1, totalPaginas: 1 }
                });
            }

            // PAGINAÇÃO INTELIGENTE
            // Se a URL for /api/eventos?pagina=2, ele pega a página 2
            const pagina = parseInt(req.query.pagina) || 1;

            // Define o limite como 6 (para combinar com seu layout de "ver mais")
            // Mas aceita se o front quiser mudar (?limite=10)
            const limite = parseInt(req.query.limite) || 6;

            const offset = (pagina - 1) * limite; // Cálculo do pulo

            // Busca os dados e o total
            const eventos = await EventosModel.getAll(limite, offset);
            const totalItens = await EventosModel.countTotal();
            const totalPaginas = Math.ceil(totalItens / limite);

            // Resposta Estruturada
            res.json({
                dados: eventos,       // Array com os 6 eventos da vez
                meta: {
                    totalItens,       // Ex: 50
                    totalPaginas,     // Ex: 9 páginas (50 / 6)
                    paginaAtual: pagina,
                    itensPorPagina: limite
                }
            });

        } catch (erro) {
            console.error(erro);
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

            let dados = { ...req.body };
            // Processa a imagem: Se o usuário mandou nova, o Helper apaga a antiga automaticamente
            dados.imagem = FileHelper.processarImagem(req, eventoAntigo);
            // Conversão numérica
            dados.latitude = dados.latitude ? parseFloat(dados.latitude) : null;
            dados.longitude = dados.longitude ? parseFloat(dados.longitude) : null;

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