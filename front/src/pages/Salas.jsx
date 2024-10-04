// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import SalaFilter from '../components/SalaFilter';
// import SalaList from '../components/SalaList';
// import FetchSalasService from '../services/FetchSalasService';
// import HeaderHero from '../components/HeaderHero.jsx';
// import Footer from '../components/Footer';
// import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
// import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';

// const Salas = () => {
//     const [page, setPage] = useState(1);
//     const [total, setTotal] = useState(null);
//     const pageSize = 8;
//     const [filters, setFilters] = useState({});
//     const [filteredSalas, setFilteredSalas] = useState([]);

//     useEffect(() => {
//         const fetchSalas = async () => {
//             const data = await FetchSalasService(filters, page, pageSize);
//             setTotal(data.total);
//             setFilteredSalas(data.rows);
//         };

//         fetchSalas();
//     }, [page, filters, pageSize]);

//     const handleFilterChange = async (newFilters) => {
//         setFilters(newFilters);
//         setPage(1); // Reinicia la paginación cuando cambian los filtros
//     };

//     const totalPages = total ? Math.ceil(total / pageSize) : 0;

//     return (
//         <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: '100%' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="container-salas"
//         >
//             <HeaderHero />
//             <div className="hero bg-hero-salas bg-cover relative before:content-[''] before:bg-white/[.10] before:absolute before:w-full before:h-full">
//                 <h1 className="hero-title text-white">Encuentra tu Sala</h1>
//                 <p className="hero-subtitle text-white">
//                     Descubre y explora distintas salas, conecta con ellos y crea
//                     música juntos.
//                 </p>
//             </div>
//             <div className="sala-filter-form-container">
//                 <SalaFilter onFilterChange={handleFilterChange} />
//             </div>
//             <div className="sala-list-container">
//                 {filteredSalas.length > 0 ? (
//                     <SalaList salas={filteredSalas} />
//                 ) : (
//                     <p>No se encontraron salas</p>
//                 )}
//             </div>
//             {totalPages > 1 && (
//                 <div className="flex gap-3 justify-center my-16">
//                     <button
//                         disabled={page === 1}
//                         onClick={() => setPage(page - 1)}
//                     >
//                         <MdKeyboardDoubleArrowLeft className="text-xl" />
//                     </button>
//                     <p>
//                         {page} de {totalPages}
//                     </p>
//                     <button
//                         disabled={page >= totalPages}
//                         onClick={() => setPage(page + 1)}
//                     >
//                         <MdKeyboardDoubleArrowRight className="text-xl" />
//                     </button>
//                 </div>
//             )}

//             <Footer />
//         </motion.div>
//     );
// };

// export default Salas;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SalaFilter from '../components/SalaFilter';
import SalaList from '../components/SalaList';
import FetchSalasService from '../services/FetchSalasService';
import HeaderHero from '../components/HeaderHero.jsx';
import Footer from '../components/Footer';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';

const Salas = () => {
    const [page, setPage] = useState(1); // Estado para la página actual
    const [total, setTotal] = useState(null); // Total de elementos
    const pageSize = 8; // Tamaño de cada página
    const [filters, setFilters] = useState({}); // Filtros activos
    const [filteredSalas, setFilteredSalas] = useState([]); // Salas filtradas

    // Fetch de las salas basado en los filtros y la página actual
    useEffect(() => {
        const fetchSalas = async () => {
            const data = await FetchSalasService(filters, page, pageSize);
            setTotal(data.total); // Total de salas disponibles
            setFilteredSalas(data.rows); // Salas filtradas
        };

        fetchSalas();
    }, [page, filters, pageSize]); // Se ejecuta solo cuando cambian la página, filtros o el tamaño de página

    // Actualiza los filtros y resetea la página a la primera SOLO SI los filtros cambian
    const handleFilterChange = async (newFilters) => {
        if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
            setFilters(newFilters); // Aplica los nuevos filtros
            setPage(1); // Reinicia la paginación cuando cambian los filtros
        }
    };

    // Manejo de la paginación sin interferir con los filtros
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const totalPages = total ? Math.ceil(total / pageSize) : 0; // Calcula las páginas totales

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100%' }}
            exit={{ opacity: 0, height: 0 }}
            className="container-salas"
        >
            <HeaderHero />
            <div className="hero bg-hero-salas bg-cover bg-center relative before:content-[''] before:bg-white/[.10] before:absolute before:w-full before:h-full">
                <h1 className="hero-title text-white">Encuentra tu Sala</h1>
                <p className="hero-subtitle text-white">
                    Descubre y explora distintas salas, conéctate con ellas y
                    lleva tu música en vivo a nuevos escenarios
                </p>
            </div>
            <div className="sala-filter-form-container">
                <SalaFilter onFilterChange={handleFilterChange} />
            </div>
            <div className="sala-list-container">
                {filteredSalas.length > 0 ? (
                    <SalaList salas={filteredSalas} />
                ) : (
                    <p>No se encontraron salas</p>
                )}
            </div>

            {/* Controles de paginación */}
            {totalPages > 1 && (
                <div className="flex gap-3 justify-center my-16">
                    <button
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)} // Cambia de página sin interferir con los filtros
                    >
                        <MdKeyboardDoubleArrowLeft className="text-xl" />
                    </button>
                    <p>
                        {page} de {totalPages}
                    </p>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => handlePageChange(page + 1)} // Cambia de página sin interferir con los filtros
                    >
                        <MdKeyboardDoubleArrowRight className="text-xl" />
                    </button>
                </div>
            )}

            <Footer />
        </motion.div>
    );
};

export default Salas;
