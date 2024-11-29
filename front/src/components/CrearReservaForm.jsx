import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';
import { useState } from 'react';
import Toastify from './Toastify.jsx';
import { toast } from 'react-toastify';
import { ConfirmationModal } from './ConfirmModal.jsx';

export const CrearReservaForm = ({ nombreSala }) => {
    const { idSala } = useParams(); // Obtén el idSala de los parámetros de la URL
    const url = `${import.meta.env.VITE_API_URL_BASE}/reservar-sala/${idSala}`; // Construye la URL con el idSala
    const { token } = useAuth(); // Obtén el token de autenticación
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar el modal de confirmación
    const [formValues, setFormValues] = useState(null); // Estado para almacenar los valores del formulario

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        setFormValues(formData); // Almacena los valores del formulario en el estado
        setIsModalOpen(true); // Abre el modal de confirmación
    };

    const handleConfirm = async () => {
        setIsModalOpen(false); // Cierra el modal
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                },
                body: formValues, // Envía los valores del formulario
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al crear la reserva'); // Maneja posibles errores del servidor
            }

            toast.success(
                'Reserva creada con éxito. Espere a que la sala confirme su reserva.'
            ); // Notificación de éxito
        } catch (error) {
            toast.error(error.message); // Notificación de error
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false); // Cierra el modal si el usuario cancela
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2 border-t border-gray-300 pt-4 mb-14 mx-auto max-w-700 md:py-10 md:items-center"
            >
                <h2 className="text-2xl font-semibold mb-3">
                    Contacta con {nombreSala}
                </h2>
                <p>
                    Rellena el siguiente formulario y {nombreSala} recibirá un
                    email con tu solicitud.
                </p>
                <div className="my-2 flex gap-3 md:gap-8">
                    <label htmlFor="fecha">
                        <span className="font-semibold">
                            Fecha en la que quieres tocar*
                        </span>
                        <input
                            className="block md:mx-auto"
                            type="date"
                            name="fecha"
                            required
                        />
                    </label>
                    <label
                        htmlFor="flexible"
                        className="flex items-baseline gap-3"
                    >
                        <span className="font-semibold">
                            ¿Fechas flexibles?
                        </span>
                        <input type="checkbox" name="flexible" id="flexible" />
                    </label>
                </div>

                <label htmlFor="message" className="w-full">
                    <span className="font-semibold">Mensaje:</span>

                    <textarea
                        name="message"
                        className="form-textarea min-h-28"
                        maxLength="1000"
                    ></textarea>
                    <p className="mt-1 text-gray-500 text-sm">
                        1000 caracteres como máximo
                    </p>
                </label>

                <button
                    className="button bg-red-500 py-2 px-4 max-w-20 text-sm self-end"
                    type="reset"
                >
                    Borrar
                </button>
                <div className="flex flex-wrap gap-8 mt-6 justify-center">
                    <button
                        className="bg-gradient-to-r from-moradoOiches to-purpleOiches text-white font-bold py-2 px-8 rounded-lg shadow-lg transition-transform hover:scale-105"
                        type="submit"
                    >
                        Enviar solicitud
                    </button>
                </div>
            </form>
            <ConfirmationModal
                isOpen={isModalOpen}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                text={'¿Estás seguro de que quieres enviar esta reserva?'}
                classCancel={'bg-red-500'}
            />
            <Toastify />
        </>
    );
};
