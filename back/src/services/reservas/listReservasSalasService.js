import getPool from '../../database/getPool.js';
import generateErrorsUtil from '../../utils/generateErrorsUtil.js';

export const listReservasSalasService = async (sala_id, userInfo) => {
    try {
        const pool = await getPool();

        // Verificar si la sala pertenece al usuario o si es admin
        const [salaResults] = await pool.query(
            'SELECT nombre FROM salas WHERE usuario_id = ? AND id = ?',
            [userInfo[0].id, sala_id]
        );

        if (salaResults.length === 0 && userInfo[0].roles !== 'admin') {
            throw generateErrorsUtil(
                'No se han encontrado salas para el usuario con el que estás logueado.',
                400
            );
        }

        // Obtener las reservas de la sala
        const [allReservas] = await pool.query(
            `SELECT reservas.*, grupos.nombre AS grupo_nombre, salas.id AS sala_id, salas.nombre AS sala_nombre, usuarios.email
                FROM reservas
                LEFT JOIN grupos ON reservas.grupo_id = grupos.id
                LEFT JOIN salas ON reservas.sala_id = salas.id
                LEFT JOIN usuarios ON grupos.usuario_id = usuarios.id
                WHERE reservas.sala_id = ?
                ORDER BY createdAt DESC`,
            [sala_id]
        );
        const today = new Date();

        // Filtrar y ordenar según la condición especial
        const reservas = [];
        const reservasAtrasadas = [];

        for (const reserva of allReservas) {
            if (reserva.confirmada === '1' && reserva.fecha < today) {
                reservasAtrasadas.push(reserva);
            } else {
                reservas.push(reserva);
            }
        }

        return [...reservas, ...reservasAtrasadas];
    } catch (error) {
        console.log(error);
        throw error;
    }
};
