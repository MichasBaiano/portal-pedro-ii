import fs from 'fs';

export class FileHelper {
    
    // Lógica inteligente para definir qual imagem salvar
    static processarImagem(req, itemAntigo) {
        // Cenário 1: Usuário enviou uma nova imagem
        if (req.file) {
            // O Cloudinary (via multer) já salvou e nos deu o link completo em .path
            return req.file.path; 
        }

        // Cenário 2: Usuário não enviou nada, mantém a antiga
        if (itemAntigo) {
            return itemAntigo.imagem;
        }

        // Cenário 3: Criando do zero sem imagem
        return null; 
    }

    // Função para apagar
    static deletarArquivo(caminho) {
        // Como o caminho agora é uma URL (https://res.cloudinary...), 
        // tentar apagar do disco quebraria o servidor.
        
        if (caminho) {
            console.log(`[Cloudinary] Arquivo antigo seria deletado (ignorando fs.unlink): ${caminho}`);
            // No futuro, podemos adicionar aqui a chamada da API do Cloudinary para apagar de verdade
        }
    }
}