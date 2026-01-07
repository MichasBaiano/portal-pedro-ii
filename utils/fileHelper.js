import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const FileHelper = {
    // Lógica inteligente para definir qual imagem salvar
    processarImagem: (req, objetoAntigo = null) => {
        // Se o usuário enviou um arquivo novo, usamos ele
        if (req.file) {
            // Se já existia uma imagem antiga, deleta
            if (objetoAntigo && objetoAntigo.imagem) {
                FileHelper.deletarArquivo(objetoAntigo.imagem);
            }
            return '/uploads/' + req.file.filename;
        }
        
        // Se não enviou nada, mantemos a imagem que já estava no banco
        if (objetoAntigo && objetoAntigo.imagem) {
            return objetoAntigo.imagem;
        }

        return null; // Ou uma imagem padrão se preferir
    },

    // Função para apagar o arquivo físico do computador
    deletarArquivo: (caminhoRelativo) => {
        if (!caminhoRelativo) return;

        // Remove a parte "/uploads/" para pegar só o nome, ou ajusta o caminho conforme sua estrutura
        // O caminho salvo no banco é "/uploads/nome.jpg". Precisamos chegar em "public/uploads/nome.jpg"
        
        try {
            // Ajuste do caminho: sai de 'utils', volta pra raiz, entra em 'public'
            const caminhoAbsoluto = path.join(__dirname, '../public', caminhoRelativo);
            
            if (fs.existsSync(caminhoAbsoluto)) {
                fs.unlinkSync(caminhoAbsoluto); // Deleta o arquivo
                console.log(`Arquivo deletado: ${caminhoAbsoluto}`);
            }
        } catch (err) {
            console.error("Erro ao deletar arquivo físico:", err);
        }
    }
};