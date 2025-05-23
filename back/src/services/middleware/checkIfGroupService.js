import getPool from '../../database/getPool.js';
import generateErrorsUtil from '../../utils/generateErrorsUtil.js';

const checkIfGroupService = async (currentUser) => {
    const pool = await getPool();

    const [userResults] = await pool.query(
        'SELECT roles FROM usuarios WHERE id = ?',
        [currentUser.id]
    );

    if (
        userResults[0].roles === 'admin' ||
        userResults[0].roles === 'agencia'
    ) {
        return;
    }

    if (userResults.length === 0 || userResults[0].roles !== 'grupo') {
        throw generateErrorsUtil(
            'Acceso denegado. No es un usuario de tipo grupo.',
            403
        );
    }
};

export default checkIfGroupService;
