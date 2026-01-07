import { body } from 'express-validator';
import { validate } from './validationHandler.js';

export const eventoValidator = [
    // Regras
    body('nome')
        .notEmpty().withMessage('O nome do evento é obrigatório.')
        .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres.'),
    
    body('data')
        .notEmpty().withMessage('A data é obrigatória.')
        // Verifica se é uma data válida (ISO8601 ex: YYYY-MM-DD)
        .isISO8601().withMessage('Data inválida. Use o formato AAAA-MM-DD.'), 

    body('local')
        .notEmpty().withMessage('O local é obrigatório.'),

    body('latitude')
        .optional()
        .isNumeric().withMessage('A latitude deve ser um número.'),

    body('longitude')
        .optional()
        .isNumeric().withMessage('A longitude deve ser um número.'),

    // Chama o nosso motor de validação no final
    validate 
];