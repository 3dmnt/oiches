import getPool from '../../database/getPool.js';
import sendMailUtil from '../../utils/sendMailUtil.js';
import generateErrorsUtil from '../../utils/generateErrorsUtil.js';

const borrarReservaSalaService = async (reserva_id) => {
    try {
        const pool = await getPool();

        // Traer el id de la sala
        const [idSala] = await pool.query(
            'SELECT grupo_id, sala_id, fecha FROM reservas WHERE id = ?',
            [reserva_id]
        );
        const grupoId = idSala[0].grupo_id;
        const dateReserva = idSala[0].fecha;
        const salaId = idSala[0].sala_id;

        // Comprobar que la reserva existe
        if (idSala.length === 0)
            throw generateErrorsUtil(
                'No se ha encontrado la reserva que intentas borrar.',
                404
            );

        // Comprobar el nombre del músico y usuario_id del músico o agencia
        const [usuarioId] = await pool.query(
            'SELECT usuario_id, nombre FROM grupos WHERE id = ?',
            [grupoId]
        );
        const userGrupoId = usuarioId[0].usuario_id;
        const grupoNombre = usuarioId[0].nombre;

        // Comprobar el email y nombre de usuario del grupo/agencia
        const [datosGrupoAgencia] = await pool.query(
            'SELECT email, username FROM usuarios WHERE id = ?',
            [userGrupoId]
        );
        const userNameGrupoAgencia = datosGrupoAgencia[0].username;
        const grupoAgenciaEmail = datosGrupoAgencia[0].email;

        // Comprobar el nombre de la sala
        const [salaName] = await pool.query(
            'SELECT nombre FROM salas WHERE id = ?',
            [salaId]
        );
        const nameSala = salaName[0].nombre;

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}-${month}-${year}`;
        };
        const formatedFecha = formatDate(new Date(dateReserva));

        // Creamos el asunto del email de verificación.
        const emailSubject = `Cancelación de tu solicitud para el concierto en ${nameSala}`;

        // Creamos el contenido del email
        const emailBody = `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-size: 12px; /* Tamaño general reducido */
                            font-family: Arial, sans-serif;
                            line-height: 1.4; /* Altura de línea para mayor legibilidad */
                        }
                        .small-text {
                            font-size: 8px; /* Tamaño de texto aún más pequeño */
                        }
                        a {
                            color: #000000;
                        }
                        a:hover {
                            text-decoration: underline; /* Subrayado al pasar el mouse */
                        }
                        p {
                            margin: 8px 0; /* Espaciado entre párrafos */
                        }
                    </style>
                </head>
                <body>
                    <p>Hola, ${userNameGrupoAgencia}</p>
        
                    <p>Lamentamos informarte que tu solicitud para el concierto de ${grupoNombre} el ${formatedFecha} en la sala ${nameSala} ha sido cancelada.</p>

                    <pQuedamos a tu disposición para cualquier consulta.</p>

                    <p>--</p>
    <p style="font-size:12px">
        <strong>Equipo Oiches</strong><br>
        <strong><a href="mailto:hola@oiches.com" style="color:#000; text-decoration:none;">hola@oiches.com</a></strong><br>
        <strong><a href="https://www.oiches.com" style="color:#000; text-decoration:none;" target="_blank">www.oiches.com</a></strong><br>
        <strong><a href="https://instagram.com/oiches_musica" style="color:#000; text-decoration:none;" target="_blank">instagram.com/oiches_musica</a></strong>
    </p>
    <br>
    <p class="small-text"><strong>AVISO SOBRE CONFIDENCIALIDAD:</strong> Esta comunicación contiene información que es confidencial y también puede contener información privilegiada. Es para uso exclusivo del destinatario/s. Si usted no es el destinatario/s tenga en cuenta que cualquier distribución, copia o uso de esta comunicación o la información que contiene está estrictamente prohibida. Si usted ha recibido esta comunicación por error por favor notifíquelo a <a href="mailto:hola@oiches.com">hola@oiches.com</a>.</p>
        <p class="small-text"><strong>PROTECCIÓN DE DATOS:</strong> Conforme a lo establecido en el Artículo 13 del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo y la Ley Orgánica 3/2018 de 5 de diciembre (LOPDGDD), le informamos que los datos personales recabados del propio interesado, serán tratados bajo la responsabilidad del Responsable del Tratamiento, Carmen Salgueiro Rodríguez, para el envío de comunicaciones sobre nuestros productos y servicios y se conservarán mientras ninguna de las partes se oponga a ello o durante el período necesario para cumplir con las obligaciones legales. Se garantiza un tratamiento de datos leal y transparente. Los datos no se cederán a terceros salvo en los casos en que exista una obligación legal. Le informamos que los derechos de acceso, rectificación, supresión, limitación de tratamiento, u oposición al tratamiento, así como el derecho a la portabilidad de los datos podrán ser ejercitados ante el responsable del tratamiento por cualquier medio sujeto en derecho, acompañando de copia de documento oficial que le identifique dirigiéndose o enviando un mensaje al correo electrónico a <a href="mailto:hola@oiches.com">hola@oiches.com</a>, según los términos que la normativa aplicable establece. Puede consultar la información adicional y detallada sobre Protección de Datos en nuestra página web <a href="https://www.oiches.com" target="_blank">oiches.com</a>. Si considera que el tratamiento no se ajusta a la normativa vigente, podrá presentar una reclamación ante la autoridad de control en <a href="https://www.agpd.es" target="_blank">www.agpd.es</a>.
    </p>
                </body>
                </html>
                 `;

        // Enviamos el email de verificación al usuario.
        try {
            await sendMailUtil(grupoAgenciaEmail, emailSubject, emailBody);
        } catch (error) {
            return;
        }

        await pool.query('DELETE FROM reservas WHERE id = ?', [reserva_id]);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default borrarReservaSalaService;
