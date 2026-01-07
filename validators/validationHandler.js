import { validationResult } from 'express-validator';
import { FileHelper } from '../utils/fileHelper.js';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    // Se mão tiver erros, deixa passar para o controller
    if (errors.isEmpty()) {
        return next();
    }

    // SE TIVER ERROS:
    // 1. Se o usuário fez upload de imagem, apaga para não deixar lixo (já que o cadastro falhou)
    if (req.file) {
        FileHelper.deletarArquivo('/uploads/' + req.file.filename);
    }

    // 2. Retorna o erro (Bad Request 400)
    return res.status(400).json({ 
        erro: "Erro de validação", 
        detalhes: errors.array() 
    });
};