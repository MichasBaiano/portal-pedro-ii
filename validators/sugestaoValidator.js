import { body } from 'express-validator';
import { validate } from './validationHandler.js';

export const sugestaoValidator = [
    body('nome')
        .notEmpty().withMessage('O nome é obrigatório.'),
    body('mensagem')
        .notEmpty().withMessage('A mensagem não pode ser vazia.')
        .isLength({ min: 10 }).withMessage('A mensagem deve ter pelo menos 10 caracteres.'),
    body('email')
        .optional()
        .isEmail().withMessage('Formato de e-mail inválido.'),
        
    validate // Chama o motor que checa e responde o erro
];