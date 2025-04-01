import { useState } from 'react';
import { Input } from '../Input.jsx';
import { toast } from 'react-toastify';
import Toastify from '../Toastify.jsx';
import RecoverPasswordService from '../../services/Users/RecoverPasswordService.js';

const RecoverPasswordForm = () => {
    const [email, setEmail] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formValues = new FormData(e.target);
            const dataForm = {
                email: formValues.get('email'),
            };
            await RecoverPasswordService(dataForm);

            toast.success(
                'Se ha enviado un enlace de recuperación a tu correo electrónico'
            );
        } catch (error) {
            toast.error('Error al enviar el enlace de recuperación');
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="flex justify-between md:justify-evenly max-w-md flex-col gap-5 p-4 lg:w-1/3 mx-auto lg:my-20 my-16"
            >
                <h1 className="text-4xl">Recupera tu acceso</h1>
                <p>
                    ¿Olvidaste o perdiste tu contraseña?
                    <br />
                    Escribe tu correo y te enviaremos un enlace para resetearla.
                </p>
                <div className="flex flex-col gap-5 justify-center">
                    <label htmlFor="email">
                        Email*
                        <Input
                            type="email"
                            name="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                        />
                    </label>
                    <button
                        type="submit"
                        className="p-4 w-full text-white hover:text-black hover:bg-opacity-80 transition-all bg-purpleOiches text-xl justify-center rounded"
                    >
                        Enviar enlace
                    </button>
                </div>
            </form>
            <Toastify />
        </>
    );
};

export default RecoverPasswordForm;
