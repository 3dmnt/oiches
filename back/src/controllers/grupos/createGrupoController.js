import validateSchemaUtil from '../../utils/validateSchemaUtil.js';
import createGrupoSchema from '../../schemas/grupos/createGrupoSchema.js';
import { uploadFiles } from '../../utils/uploadFiles.js';
import insertGrupoService from '../../services/grupos/insertGrupoService.js';
import { insertGrupoPhotoService } from '../../services/grupos/insertGrupoPhotoService.js';
import { insertGrupoMediaService } from '../../services/grupos/insertGrupoMediaService.js';
import { insertGrupoGenerosService } from '../../services/grupos/insertGrupoGenerosService.js';
import selectUserByIdService from '../../services/users/selectUserByIdService.js';
import generateErrorsUtil from '../../utils/generateErrorsUtil.js';

const createGrupoController = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const adminUser = await selectUserByIdService(req.user.id);

        const {
            nombre,
            provincia,
            web,
            generos,
            honorarios,
            honorarios_to,
            condiciones,
            biografia,
            mediaA,
            mediaB,
            mediaC,
            mediaD,
        } = req.body;

        const medias = [mediaA, mediaB, mediaC, mediaD].filter(Boolean); // Filtrar valores no nulos

        // Validamos el body con Joi.
        await validateSchemaUtil(
            createGrupoSchema,
            Object.assign(req.body, req.files || {})
        );

        if (req.user.id !== userId && adminUser[0].roles !== 'admin')
            throw generateErrorsUtil('No puedes crear este proyecto', 400);

        const grupoId = await insertGrupoService(
            nombre,
            provincia,
            web,
            honorarios,
            honorarios_to,
            condiciones,
            biografia,
            userId
        );

        // Insertamos los géneros
        const generosList = [];
        if (generos) {
            const generosArray = Array.isArray(generos)
                ? generos
                : generos.split(',');

            for (const genero of generosArray) {
                await insertGrupoGenerosService(genero.trim(), grupoId);
                generosList.push({ generoId: genero.trim() });
            }
        }

        // Insertamos los videos
        const mediaUrls = [];
        for (const media of medias) {
            await insertGrupoMediaService(media, grupoId);
            mediaUrls.push({ url: media });
        }

        // Array donde pushearemos las fotos (si hay).
        const photos = [];

        // Si "req.files" existe quiere decir que hay algún archivo en la petición.
        if (req.files) {
            // Recorremos las fotos. Para evitar que tenga más de 4 fotos aplicamos slice.
            for (const photo of Object.values(req.files).slice(0, 5)) {
                // Guardamos la foto y obtenemos su nombre. Redimensionamos a un ancho de 600px.
                const photoName = await uploadFiles(photo);

                // Insertamos la foto en la tabla de fotos.
                await insertGrupoPhotoService(photoName, grupoId);

                // Pusheamos la foto al array de sala_fotos.
                photos.push({
                    name: photoName,
                });
            }
        }
        res.send({
            status: 'ok',
            data: {
                grupo: {
                    id: grupoId,
                    userId,
                    generos: generosList,
                    nombre,
                    provincia,
                    web,
                    honorarios,
                    honorarios_to,
                    condiciones,
                    biografia,
                    photos,
                    medias: mediaUrls,
                    createdAt: new Date(),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export default createGrupoController;
