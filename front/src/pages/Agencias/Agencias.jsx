import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AgenciaFilter from '../../components/Agencias/AgenciaFilter.jsx';
import AgenciaList from '../../components/Agencias/AgenciaList.jsx';
import FetchAgenciasService from '../../services/Agencias/FetchAgenciasService.js';
import HeaderHero from '../../components/HeaderHero.jsx';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer.jsx';
import Paginator from '../../components/Paginator.jsx';
import Seo from '../../components/SEO/Seo.jsx';
import Conectate from '../../components/Conectate.jsx';
import { IoFilter } from 'react-icons/io5';
import FeatureGridAgencias from '../../components/Agencias/FeatureGridAgencias.jsx';

const Agencias = () => {
    const [page, setPage] = useState(1); // Estado para la página actual
    const [total, setTotal] = useState(null); // Total de elementos
    const pageSize = 12; // Tamaño de cada página
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [filters, setFilters] = useState({}); // Filtros activos
    const [filteredAgencias, setFilteredAgencias] = useState([]); //

    useEffect(() => {
        const fetchAgencias = async () => {
            const data = await FetchAgenciasService(filters, page, pageSize);
            setTotal(data.total);
            setFilteredAgencias(data.result);
        };

        fetchAgencias();
    }, [page, filters, pageSize]);

    // Actualiza los filtros y resetea la página a la primera SOLO SI los filtros cambian
    const handleFilterChange = async (newFilters) => {
        if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
            setFilters(newFilters);
            setPage(1);
        }
    };

    return (
        <>
            {/* Componente SEO dinámico */}
            <Seo
                title="Oiches | Encuentra managers y agencias musicales"
                description="Explora y contacta directamente con las mejores agencias y manager a través de Oiches."
                keywords="agencias musicales, managers, música en vivo, reservas de salas, eventos musicales, donde tocar, conciertos en vivo"
                url="https://oiches.com/agencias"
                image="https://oiches.com/Oiches-Conectamos-musicos-y-salasRRSS.jpg"
                type="website"
                imageType="image/jpg"
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    itemListElement: filteredAgencias.map((agencia, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        name: agencia.nombre,
                        url: `https://oiches.com/agencia/${agencia.id}`,
                    })),
                }}
            />

            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: '100%' }}
                exit={{ opacity: 0, height: 0 }}
            >
                <HeaderHero />

                <section className="hero relative flex flex-col justify-center items-start bg-hero-promotor bg-cover bg-center md:h-[680px] p-8 md:p-16">
                    <div className="text-left max-w-lg mr-auto">
                        <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight">
                            Encuentra tu agencia
                        </h1>
                        <p className="text-white text-lg md:text-xl mt-4 mb-3 max-[600px]:hidden">
                            Descubre y conecta con mánagers y agencias musicales
                        </p>
                        <p className="text-white text-2xl md:text-3xl font-semibold mt-0.25 mb-8">
                            ¡Vive la música en cada rincón!
                        </p>
                        <div className="flex gap-4">
                            <Link
                                to="/register"
                                className="bg-moradoOiches hover:bg-purpleOiches text-white font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105"
                            >
                                Regístrate
                            </Link>
                        </div>
                    </div>
                </section>

                <section>
                    <div
                        className="flex justify-center p-2 gap-4 bg-footercolor text-white md:hidden"
                        onClick={() => setIsNavOpen((prev) => !prev)}
                    >
                        FILTRAR
                        <IoFilter className="text-2xl cursor-pointer" />
                    </div>
                    <div
                        className={`bg-footercolor flex-col items-center justify-evenly ${
                            isNavOpen ? 'flex' : 'hidden md:flex'
                        }`}
                    >
                        <div className="flex flex-col items-center justify-between w-11/12">
                            <AgenciaFilter
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                    </div>
                </section>

                <main className="w-11/12 mx-auto mt-6 mb-20 md:max-w-7xl md:mb-28">
                    <section className="sala-list-container">
                        {filteredAgencias.length > 0 ? (
                            <AgenciaList agencias={filteredAgencias} />
                        ) : (
                            <p className="text-center">
                                No se encontraron agencias
                            </p>
                        )}

                        <Paginator
                            setPage={setPage}
                            page={page}
                            total={total}
                            pageSize={pageSize}
                        />
                    </section>

                    <section className="flex flex-col gap-8 mt-20 mx-4 md:mt-28">
                        <FeatureGridAgencias />
                    </section>

                    <section className="mt-20 mx-4 flex flex-col justify-between items-center gap-16 md:flex-row md:mt-28">
                        <Conectate />
                    </section>
                </main>
                <Footer />
            </motion.div>
        </>
    );
};

export default Agencias;
