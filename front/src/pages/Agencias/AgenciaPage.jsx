import { motion } from 'framer-motion';
import Header from '../../components/Header.jsx';
import AgenciaDetails from '../../components/Agencias/AgenciaDetails.jsx';
import Footer from '../../components/Footer.jsx';

const AgenciaPage = () => {
    return (
        <>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: '100%' }}
                exit={{ opacity: 0, height: 0 }}
            >
                <Header />
                <AgenciaDetails />
                <Footer />
            </motion.div>
        </>
    );
};
export default AgenciaPage;
