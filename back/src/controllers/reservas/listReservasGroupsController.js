import { listReservaGroupsService } from '../../services/reservas/listReservaGroupsService.js';
import selectUserByIdService from '../../services/users/selectUserByIdService.js';

export const listReservasGroupsController = async (req, res, next) => {
    try {
        const { group_id } = req.params;

        const userInfo = await selectUserByIdService(req.user.id);
        const reservas = await listReservaGroupsService(group_id, userInfo);

        return res.status(200).json({
            reservas,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
