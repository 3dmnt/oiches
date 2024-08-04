import express from 'express';

// Importamos las funciones controladoras intermedias.
import {
    authUser,
    userExists,
    salaExists,
    canEditSala,
    checkIfSala,
    canEditPhoto,
} from '../middleware/index.js';

// Importamos las funciones controladoras finales.
import {
    createSalaController,
    getSalaDetailController,
    listSalasController,
    editSalaController,
    deletePhotoSalaController,
    insertPhotosSalaController,
    deleteSalaController,
    
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

// Añadir fotos a una sala
router.post(
    '/salas/photos/:idSala',
    authUser,
    userExists,
    salaExists,
    canEditSala,
    insertPhotosSalaController
);

router.delete('/salas/delete/:idSala',authUser,deleteSalaController)
// Borrar foto de una sala
router.delete(
    '/salas/:photoName/:deletePhoto',
    authUser,
    userExists,
    canEditPhoto,
    deletePhotoSalaController
);

// Endpoint detalle sala
router.get('/salas/:idSala', salaExists, getSalaDetailController);
// Endpoint de filtro/búsqueda y ordenación
router.get('/salas?', listSalasController);

export default router;
