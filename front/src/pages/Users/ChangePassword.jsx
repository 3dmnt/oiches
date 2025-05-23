import MenuForms from '../../components/MenuForms';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ChangePasswordForm from '../../components/Users/ChangePasswordForm';
import Seo from '../../components/SEO/Seo';

const ChangePassword = () => {
    const appBaseUrl = import.meta.env.VITE_APP_URL || 'https://oiches.com';

    return (
        <>
            {/* Configuración de SEO */}
            <Seo
                title="Cambiar Contraseña - Oiches"
                description="Página para cambiar tu contraseña de acceso en Oiches. Sigue los pasos para restablecerla."
                url="/change-password" // URL relativa
                noIndex={true} // Evitar la indexación
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: 'Cambiar Contraseña - Oiches',
                    description:
                        'Página para cambiar tu contraseña de acceso en Oiches. Sigue los pasos para restablecerla.',
                    url: `${appBaseUrl}/change-password`, // URL con variable de entorno
                    isPartOf: {
                        '@type': 'WebSite',
                        name: 'Oiches',
                        url: appBaseUrl, // URL con variable de entorno
                    },
                }}
            />
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: '100%' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:flex"
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
                <ChangePasswordForm />
            </motion.div>
        </>
    );
};

export default ChangePassword;
