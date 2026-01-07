import { body } from 'express-validator';
import { validate } from './validationHandler.js';

export const bannerValidator = [
    body('titulo')
        .notEmpty().withMessage('O título do banner é obrigatório.'),
    
    body('link')
        .optional()
        .isURL().withMessage('O link deve ser uma URL válida (http://...).'),

    validate
];