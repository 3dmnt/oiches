import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import MenuForms from '../../components/MenuForms.jsx';
import Toastify from '../../components/Toastify.jsx';
import { useState } from 'react';
import { Input } from '../../components/Input.jsx';
import { toast } from 'react-toastify';
import Seo from '../../components/SEO/Seo.jsx'; // Importamos el componente SEO

export const ValidateUser = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { VITE_API_URL_BASE } = import.meta.env;
    const navigate = useNavigate();
    const { code: paramCode } = useParams(); // Obtén el código de los parámetros de la URL

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        setLoading(true);

        const formData = new FormData(e.target);
        // const code = formData.get('code');
        const formCode = formData.get('code');

        // Usar `paramCode` si existe, sino usar `formCode`
        const code = paramCode || formCode;

        if (!code) {
            setError('El código es obligatorio.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${VITE_API_URL_BASE}/users/validate/${code}`
            );

            const data = await response.json();

            if (response.ok) {
                toast.success('Usuario validado con éxito');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                throw new Error(data.message || 'Error validating user');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* SEO para esta página */}
            <Seo
                title="Validar Usuario - Oiches"
                description="Valida tu usuario en Oiches para disfrutar de todas las funcionalidades de la plataforma."
                url="https://oiches.com/validate-user"
                keywords="validar usuario, Oiches, activación de cuenta"
                noIndex={true} // No indexar esta página
            />
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: '100%' }}
                exit={{ opacity: 0, height: 0 }}
                className="h-screen md:flex md:w-screen"
            >
                <MenuForms
                    signInLogin={
                        <>
                            <p className="max-[360px]:hidden">
                                ¿Ya tienes cuenta?
                            </p>
                            <Link
                                to="/login"
                                className="hover:text-purpleOiches md:text-yellowOiches ml-2"
                            >
                                Login
                            </Link>
                        </>
                    }
                />
                <div className="flex justify-between md:justify-evenly max-w-md flex-col gap-y-5 lg:w-1/3 mx-auto lg:mt-20 my-14 p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >
                        <h1 className="text-4xl">
                            Introduce tu código de validación de usuario:
                        </h1>
                        <hr />

                        <div className="flex flex-col gap-5 justify-center">
                            <label htmlFor="code">
                                <Input
                                    type="text"
                                    name="code"
                                    placeholder="Código de validación"
                                    required={!paramCode} // Solo es obligatorio si no viene de los params
                                    className="form-input"
                                    defaultValue={paramCode || ''} // Mostrar el código de params si está disponible
                                />
                            </label>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <button
                            type="submit"
                            className="p-4 w-full text-white hover:text-black hover:bg-opacity-80 transition-all bg-purpleOiches text-xl justify-center rounded"
                            disabled={loading}
                        >
                            {loading ? 'Validando...' : 'Validar usuario'}
                        </button>
                    </form>
                </div>
                <Toastify />
            </motion.div>
        </>
    );
};
