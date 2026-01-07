import { EstabelecimentosModel } from "../models/estabelecimentoModel.js";
import { FileHelper } from "../utils/fileHelper.js";


export class EstabelecimentosController {
    static async listar(req, res) {
        try {
            const busca = req.query.q;
            const resultados = busca ? await EstabelecimentosModel.search(busca) : await EstabelecimentosModel.getAll();
            res.json(resultados);
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao buscar locais." });
        }
    }

    static async criar(req, res) {
        try {
            let dados = req.body;
            dados.imagem = FileHelper.processarImagem(req, null);

            const novo = await EstabelecimentosModel.create(dados);
            res.status(201).json(novo);
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao criar local." });
        }
    }

    static async editar(req, res) {
        try {
            const id = req.params.id;
            const localAntigo = await EstabelecimentosModel.getById(id);

            if (!localAntigo) return res.status(404).json({ erro: "Local não encontrado" });

            const dados = {
                ...req.body,
                imagem: FileHelper.processarImagem(req, localAntigo)
            };

            const atualizado = await EstabelecimentosModel.update(id, dados);
            res.json(atualizado);
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao atualizar local." });
        }
    }

    static async deletar(req, res) {
        try {
            const id = req.params.id;
            const item = await EstabelecimentosModel.getById(id);
            if (item) {
                FileHelper.deletarArquivo(item.imagem); // Limpa disco
                await EstabelecimentosModel.delete(id); // Limpa banco
            }
            res.json({ mensagem: "Local deletado!" });
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao deletar local." });
        }
    }

    static async getEstabelecimento(req, res) {
        try {
            const local = await EstabelecimentosModel.getById(req.params.id);
            if (local) res.json(local);
            else res.status(404).json({ erro: "Não encontrado" });
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao buscar local." });
        }
    }

    static async alternarDestaque(req, res) {
        const { id } = req.params;
        try {
            // 1. Busca o local para saber o estado atual
            const local = await EstabelecimentosModel.getById(id);
            if (!local) return res.status(404).json({ error: "Local não encontrado" });

            // 2. Inverte o valor (se era 1 vira 0, se era 0 vira 1)
            const novoStatus = local.destaque ? 0 : 1;

            // 3. Salva
            await EstabelecimentosModel.updateDestaque(id, novoStatus);

            res.json({ sucesso: true, novoStatus });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ error: "Erro ao atualizar destaque" });
        }
    }
}