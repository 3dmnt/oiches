import listAllReservaService from '../../services/reservas/listAllReservaService.js';

const listAllReservas = async (req, res, next) => {
    try {
        const filters = {
            salaname: req.query.salaname || '',
            gruponame: req.query.gruponame || '',
            confirm: req.query.confirm || '',
            order: req.query.order || 'DESC',
            page: req.query.page || 1,
            pageSize: req.query.pageSize || 25,
        };

        const reservas = await listAllReservaService(filters);

        res.send({
            status: 'ok',
            data: {
                reservas,
            },
        });
    } catch (error) {
        next(error);
    }
};

export default listAllReservas;
