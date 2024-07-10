// Importamos joi.
import Joi from 'joi';
import imgSchema from '../imgSchema.js';

// Importamos los mensajes de error personalizados.
import joiErrorMessages from '../joiErrorMessages.js';

// Creamos el esquema de Joi donde comprobamos todas las propiedades necesarias.
const createSalaSchema = Joi.object({
    nombre: Joi.string().required().messages(joiErrorMessages),
    capacidad: Joi.number().positive().integer().messages(joiErrorMessages),
    descripcion: Joi.string().max(2000).messages(joiErrorMessages),
    precios: Joi.number().min(0).messages(joiErrorMessages),
    direccion: Joi.string().required().messages(joiErrorMessages),
    condiciones: Joi.string().max(2000).messages(joiErrorMessages),
    equipamiento: Joi.string().max(2000).messages(joiErrorMessages),
    email: Joi.string().email().required().messages(joiErrorMessages),
    generos: Joi.any().required().messages(joiErrorMessages),
    provincia: Joi.number().max(50).required().messages(joiErrorMessages),
    photoA: imgSchema.optional(),
    photoB: imgSchema.optional(),
    photoC: imgSchema.optional(),
    photoD: imgSchema.optional(),
});

export default createSalaSchema;
