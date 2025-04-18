import getPool from '../../database/getPool.js';
import generateErrorsUtil from '../../utils/generateErrorsUtil.js';

const agenciaExistsService = async (idAgencia) => {
    const pool = await getPool();

    const [agencia] = await pool.query(
        `
            SELECT id FROM agencias WHERE id=?
        `,
        [idAgencia]
    );

    if (!agencia.length) {
        throw generateErrorsUtil('Agencia no encontrada', 400);
    }
};

export default agenciaExistsService;
