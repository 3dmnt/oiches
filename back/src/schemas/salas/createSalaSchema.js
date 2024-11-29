// Importamos joi.
import Joi from 'joi';
import imgSchema from '../imgSchema.js';
import fileSchema from '../fileSchema.js';

// Importamos los mensajes de error personalizados.
import joiErrorMessages from '../joiErrorMessages.js';

// Creamos el esquema de Joi donde comprobamos todas las propiedades necesarias.
const createSalaSchema = Joi.object({
    nombre: Joi.string().required().messages(joiErrorMessages),
    generos: Joi.alternatives().try(
        Joi.array().items(Joi.number().integer().positive()), // Permitir cualquier ID de género positivo
        Joi.string().custom((value, helpers) => {
            const generosArray = value.split(',').map(Number);
            const valid = generosArray.every(
                (genero) => Number.isInteger(genero) && genero > 0
            );
            if (!valid) {
                return helpers.message('Género no válido');
            }
            return generosArray;
        }, 'Géneros validados')
    ),
    capacidad: Joi.number().positive().integer().messages(joiErrorMessages),
    descripcion: Joi.string().max(2000).messages(joiErrorMessages),
    precios: Joi.number().min(0).messages(joiErrorMessages),
    direccion: Joi.string().required().messages(joiErrorMessages),
    ciudad: Joi.string().required().messages(joiErrorMessages),
    condiciones: Joi.string().max(2000).messages(joiErrorMessages),
    equipamiento: Joi.string().max(2000).messages(joiErrorMessages),
    provincia: Joi.number().max(50).required().messages(joiErrorMessages),
    web: Joi.string().uri().messages(joiErrorMessages),
    photoA: imgSchema.optional(),
    photoB: imgSchema.optional(),
    photoC: imgSchema.optional(),
    photoD: imgSchema.optional(),
    file: fileSchema.optional(),
});

export default createSalaSchema;
