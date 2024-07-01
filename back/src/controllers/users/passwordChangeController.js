import getPool from '../../database/getPool.js';
import { passwordChangeService } from '../../services/users/passwordChangeService.js';
import validateSchemaUtil from '../../utils/validateSchemaUtil.js';
import editUserPassSchema from '../../schemas/users/editUserPassSchema.js';

export const passwordChangeController = async (req, res, next) => {
    try {
        const pool = await getPool();
        const { email, password, newPassword } = req.body;

        // Validamos el body con Joi.
        await validateSchemaUtil(editUserPassSchema, req.body);

        console.log(email, password, newPassword);

        const [[user]] = await pool.query(
            'SELECT * FROM usuarios WHERE email LIKE ?',
            [email]
        );

        if (!user) {
            throw {
                status: 404,
                message: 'Usuario no coincide con el email proporcionado.',
                code: 'Not Found',
            };
        }
        const { hashedPass } = await passwordChangeService(
            password,
            newPassword,
            user
        );

        await pool.query('UPDATE usuarios SET password = ? WHERE email = ?', [
            hashedPass,
            email,
        ]);
        return res.status(200).json({
            message: 'Contraseña cambiada exitosamente.',
        });
    } catch (error) {
        next(error);
    }
};
