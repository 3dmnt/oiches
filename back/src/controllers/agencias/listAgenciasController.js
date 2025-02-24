import listAgenciasService from '../../services/agencias/listAgenciasService.js';

const listAgenciasController = async (req, res, next) => {
    try {
        const filters = {
            nombre: req.query.nombre || '',
            provincia: req.query.provincia || '',
            order: req.query.order || 'DESC',
            page: req.query.page || 1,
            pageSize: req.query.pageSize || 12,
        };

        const agencias = await listAgenciasService(filters);
        res.status(200).send(agencias);
    } catch (error) {
        next(error);
    }
};

export default listAgenciasController;
