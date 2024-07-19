import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import { RegisterPage } from './pages/Register.jsx';
import GrupoDetail from './components/GrupoDetail.jsx';
import './App.css';
import { LoginPage } from './pages/Login.jsx';
import { RecuperarPassword } from './pages/RecuperarPassword.jsx';
import { CreacionModifciacionSala } from './pages/Creacion-ModifciacionSala.jsx';
import UserValidationPage from './pages/UserValidationPage.jsx';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatedRoutes } from './components/AnimatedRoutes.jsx';
AnimatedRoutes
function App() {
    return (
        <>
            <AnimatedRoutes/>
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
}

export default App;
