import { crearReservaService } from "../../services/reservas/crearReservaService.js";
export const crearReservaController = async (req,res,next) =>{
  try {
    const { fecha, hora, nombre } = req.body;
    if(!fecha || !hora || !nombre){
     return res.status(404).json({
        status:400,
        message:'Es necesario la fecha, hora y el nombre de la reserva.'
      })
    }
    const { token } = req.headers;
    const { sala_id } = req.params;
    if(!sala_id){
      return res.status(404).json({
        status:400,
        message:"Es necesario seleccionar una sala para reservar."
      })
                                  
    }
    const {reserva: { grupoResults, salaResults} } = await crearReservaService(fecha,hora,nombre,token,sala_id)
   
      if (grupoResults.length === 0) {
      return res.status(404).json({ message: 'No se encontró un grupo asociado al usuario.' });
    }
    const grupo_id = grupoResults[0].id;
    if (salaResults.length === 0) {
      return res.status(404).json({ message: 'Sala no encontrada.' });
    }

    res.status(200).json({
      message: 'Reserva realizada con éxito',
      reserva: {
        nombre,
        fecha,
        hora,
        sala_id,
        grupo_id
      }
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
