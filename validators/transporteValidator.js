import { body } from 'express-validator';
import { validate } from './validationHandler.js';

export const transporteValidator = [
    body('tipo')
        .notEmpty().withMessage('O tipo de transporte é obrigatório (ex: Moto, Ônibus).'),
    
    body('nome')
        .notEmpty().withMessage('O nome da empresa ou motorista é obrigatório.'),

    body('rota')
        .notEmpty().withMessage('A rota é obrigatória.'),

    body('horarios')
        .notEmpty().withMessage('Os horários são obrigatórios.'),
    
    body('contato')
        .optional()
        .isMobilePhone(),

    validate
];