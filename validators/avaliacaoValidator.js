import { body } from 'express-validator';
import { validate } from './validationHandler.js';

export const avaliacaoValidator = [
    body('nota')
        .notEmpty().withMessage('A nota é obrigatória.')
        .isInt({ min: 1, max: 5 }).withMessage('A nota deve ser um número inteiro entre 1 e 5.'),
    
    body('autor')
        .notEmpty().withMessage('O nome do autor é obrigatório.'),

    body('comentario')
        .optional()
        .isLength({ max: 500 }).withMessage('O comentário não pode passar de 500 caracteres.'),

    validate
];