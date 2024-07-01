import { cancelarReservaService } from '../../services/reservas/cancelarReservaService.js';
export const cancelarReservaController = async (req, res, next) => {
    try {
        const { token } = req.headers;
        const sala_id = req.params;

        await cancelarReservaService(token, sala_id);

        res.status(200).json({
            message: 'Se ha borrado la reserva con exito ',
        });
    } catch (error) {
        next(error);
    }
};
