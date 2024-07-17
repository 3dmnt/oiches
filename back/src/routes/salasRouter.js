import express from 'express';

// Importamos las funciones controladoras intermedias.
import {
    authUser,
    userExists,
    salaExists,
    canEditSala,
    checkIfSala,
    checkIfGroup,
    grupoCanVote,
} from '../middleware/index.js';

// Importamos las funciones controladoras finales.
import {
    createSalaController,
    getSalaDetailController,
    listSalasController,
    editSalaController,
    voteSalaController,
} from '../controllers/salas/index.js';

const router = express.Router();

//Endpoint crear nueva sala por usuario tipo sala
router.post(
    '/users/salas',
    authUser,
    userExists,
    checkIfSala,
    createSalaController
);

// Actualizar una sala
router.put(
    '/salas/:idSala/edit',
    authUser,
    userExists,
    salaExists,
    canEditSala,
    editSalaController
);

// Endpoint detalle sala
router.get('/salas/:idSala', salaExists, getSalaDetailController);

// Endpoint de filtro/búsqueda y ordenación
router.get('/salas?', listSalasController);

//Endpoint votacion y comentarios de un grupo a una sala
router.post(
    '/salas/:idReserva/votes',
    authUser,
    userExists,
    checkIfGroup,
    grupoCanVote,
    voteSalaController
);

export default router;
