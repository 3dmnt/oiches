import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input } from './Input.jsx';
import { AuthContext } from '../context/auth/auth.context.jsx';
import { loginUserService } from '../services/loginUserService.jsx';

export const LoginForm = ({ className }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const { signIn } = auth;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await loginUserService({ email, password });
            signIn(data.token, data.user);
            toast.success('Inicio de sesión exitoso');
            navigate('/');
        } catch (error) {
            setError(error.message);
            toast.error('Error al iniciar sesión');
        }
    };

    return (
        <>
            <section className="absolute top-1 left-1/2 justify-between hidden w-1/2 p-6 lg:flex lg:text-black">
                <button className="flex hover:text-purpleOiches gap-1">
                    <svg
                        className="self-center"
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.426 12t.063-.375t.212-.325l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12t-.288.713T19 13z"
                        />
                    </svg>{' '}
                    Back
                </button>
                <p>
                    ¿No tienes una cuenta?
                    <Link
                        to="/register"
                        className="hover:text-purpleOiches text-yellowOiches"
                    >
                        {' '}
                        Regístrate
                    </Link>
                </p>
            </section>
            <form onSubmit={handleSubmit} className={className}>
                <h3 className="text-4xl">Iniciar sesión</h3>
                <p>Lorem ipsum dolor sit amet consectetur</p>
                <hr />
                <div className="flex flex-col gap-5 justify-center">
                    <label htmlFor="email">
                        Usuario*
                        <Input
                            type="email"
                            name="email"
                            placeholder="Introduce tu usuario"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                        />
                    </label>
                    <label htmlFor="password">
                        Contraseña*
                        <Input
                            type="password"
                            name="password"
                            placeholder="Introduce tu contraseña"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                        />
                    </label>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button
                    type="submit"
                    className="p-4 w-full hover:text-white hover:bg-opacity-80 transition-all bg-purpleOiches text-xl justify-center rounded"
                >
                    Iniciar sesión
                </button>
                <p className="mt-4 text-center">
                    <Link
                        to="/recover-password"
                        className="hover:text-purpleOiches text-yellowOiches"
                    >
                        Recuperar contraseña
                    </Link>
                </p>
            </form>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </>
    );
};

export default LoginForm;
