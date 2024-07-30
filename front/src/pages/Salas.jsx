import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SalaFilter from '../components/SalaFilter';
import SalaList from '../components/SalaList';
import FetchSalasService from '../services/FetchSalasService';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer';

const Salas = () => {
    const [salas, setSalas] = useState([]);
    const [filteredSalas, setFilteredSalas] = useState([]);

    useEffect(() => {
        const fetchSalas = async () => {
            const initialSalas = await FetchSalasService();
            setSalas(initialSalas);
            setFilteredSalas(initialSalas);
        };

        fetchSalas();
    }, []);

    const handleFilterChange = async (filters) => {
        const filtered = await FetchSalasService(filters);
        setFilteredSalas(filtered);
    };

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100%' }}
            exit={{ opacity: 0, height: 0 }}
            className="container-salas"
        >
            <Header />
            <div className="hero w-full">
                <h1 className="hero-title">Encuentra tu Banda </h1>
                <p className="hero-subtitle">
                    Descubre y explora distintas salas, conecta con ellos y crea
                    música juntos.
                </p>
            </div>
            <div className="sala-filter-form-container">
                <SalaFilter onFilterChange={handleFilterChange} />
            </div>
            <div className="sala-list-container">
                {filteredSalas.length ? (
                    <SalaList salas={filteredSalas} />
                ) : (
                    <p>No se encontraron salas</p>
                )}
            </div>
            <Footer />
        </motion.div>
    );
};

export default Salas;
