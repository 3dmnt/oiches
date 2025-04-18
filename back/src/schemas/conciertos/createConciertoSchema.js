// Importamos joi.
import Joi from 'joi';

// Importamos los mensajes de error personalizados.
import joiErrorMessages from '../joiErrorMessages.js';

// Creamos el esquema de Joi donde comprobamos todas las propiedades necesarias.
const createConciertoSchema = Joi.object({
    reservaId: Joi.string().required().messages(joiErrorMessages),
    fecha: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages(joiErrorMessages),
    hora: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
        .required()
        .messages(joiErrorMessages),
    precio: Joi.number().positive().precision(2).messages(joiErrorMessages),
    link: Joi.string().uri().messages(joiErrorMessages),
    image: Joi.object({
        name: Joi.string().required(),
        mimetype: Joi.string()
            .valid('image/jpeg', 'image/jpg', 'image/png', 'image/webp')
            .required()
            .messages({
                'any.only':
                    'El tipo de archivo debe ser uno de los siguientes: jpeg, jpg, png, webp',
            }),
        size: Joi.number().max(3000000).required().messages({
            'number.max': 'El tamaño del archivo no debe exceder 3Mb',
        }),
    })
        .unknown(false) // Esto asegura que no se permitan propiedades no definidas en el objeto.
        .required()
        .messages({
            'any.required': 'La imagen es obligatoria.',
        }),
});

export default createConciertoSchema;
