// Importamos las dependencias.
import { v4 as uuid } from 'uuid';

import getPool from '../../database/getPool.js';

const insertSalaService = async (
    nombre,
    provincia,
    capacidad,
    descripcion,
    precios,
    direccion,
    ciudad,
    condiciones,
    equipamiento,
    web,
    horaReservasStart,
    horaReservasEnd,
    userId
) => {
    const pool = await getPool();

    // Generamos el id de la entrada.
    const salaId = uuid();

    await pool.query(
        `
            INSERT INTO salas (id, provincia, usuario_id,nombre,capacidad,descripcion,precios,direccion, ciudad, condiciones,equipamiento, web, horaReservasStart, horaReservasEnd)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `,
        [
            salaId,
            provincia,
            userId,
            nombre,
            capacidad,
            descripcion,
            precios,
            direccion,
            ciudad,
            condiciones,
            equipamiento,
            web,
            horaReservasStart,
            horaReservasEnd,
        ]
    );

    return salaId;
};

export default insertSalaService;
