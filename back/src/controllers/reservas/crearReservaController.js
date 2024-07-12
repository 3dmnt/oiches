import { crearReservaService } from '../../services/reservas/crearReservaService.js';
import validateSchemaUtil from '../../utils/validateSchemaUtil.js';
import createReservaSchema from '../../schemas/reservas/createReservaSchema.js';

const crearReservaController = async (req, res, next) => {
    try {
        const { fecha, hora, nombre } = req.body;

        // Validación con JOI
        await validateSchemaUtil(createReservaSchema, req.body);

        const { token } = req.headers;
        if (!token) {
            return res.status(401).json({
                message: 'Es necesario proporcionar un token de autorización.',
            });
        }
        const { sala_id } = req.params;
        if (!sala_id) {
            return res.status(400).json({
                message: 'Es necesario seleccionar una sala para reservar.',
            });
        }
        const now = new Date();

        const reservaDate = new Date(`${fecha}T${hora}`);

        if (reservaDate < now) {
            return res.status(400).json({
                message: 'No se puede reservar una fecha que ya ha pasado.',
            });
        }
        const {
            reserva: { grupoResults, salaResults },
        } = await crearReservaService(fecha, hora, nombre, token, sala_id);

        if (!grupoResults || grupoResults.length === 0) {
            return res.status(404).json({
                message: 'No se encontró un grupo asociado al usuario.',
            });
        }
        const grupo_id = grupoResults[0].id;
        if (!salaResults || salaResults.length === 0) {
            return res.status(404).json({ message: 'Sala no encontrada.' });
        }

        res.status(200).json({
            message: 'Reserva realizada con éxito',
            reserva: {
                nombre,
                fecha,
                hora,
                sala_id,
                grupo_id,
            },
        });
    } catch (error) {
        next(error);
    }
};

export default crearReservaController;
