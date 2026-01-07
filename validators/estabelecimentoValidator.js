import { body } from 'express-validator';
import { validate } from './validationHandler.js';

export const estabelecimentoValidator = [
    body('nome')
        .notEmpty().withMessage('O nome do local é obrigatório.')
        .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres.'),
    
    body('categoria')
        .notEmpty().withMessage('A categoria é obrigatória.'),

    body('endereco')
        .notEmpty().withMessage('O endereço é obrigatório.'),

    body('latitude')
        .optional()
        .isNumeric().withMessage('A latitude deve ser um número válido.'),

    body('longitude')
        .optional()
        .isNumeric().withMessage('A longitude deve ser um número válido.'),

    validate // Motor de validação
];