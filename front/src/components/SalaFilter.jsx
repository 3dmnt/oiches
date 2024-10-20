// import { useState, useEffect } from 'react';
// import FetchProvinciasService from '../services/FetchProvinciasService';
// import FetchGenresService from '../services/FetchGenresService';

// const SalaFilter = ({ onFilterChange }) => {
//     const [provinces, setProvinces] = useState([]);
//     const [genres, setGenres] = useState([]);
//     const [filters, setFilters] = useState({
//         nombre: '',
//         provincia: '',
//         genero: '',
//         order: '',
//     });
//     const [autoSearch, setAutoSearch] = useState(true);

//     useEffect(() => {
//         const fetchFilters = async () => {
//             await FetchProvinciasService(setProvinces);
//             await FetchGenresService(setGenres);
//         };
//         fetchFilters();
//     }, []);

//     useEffect(() => {
//         if (autoSearch) {
//             onFilterChange(filters); // Llamada automática al cambiar los filtros
//         }
//     }, [filters, onFilterChange, autoSearch]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFilters({
//             ...filters,
//             [name]: value,
//         });
//         setAutoSearch(true); // Se activa la búsqueda automática al cambiar el filtro
//     };

//     const handleSearch = () => {
//         setAutoSearch(false); // Para evitar búsquedas automáticas
//         onFilterChange(filters); // Llamada manual a la búsqueda
//     };

//     return (
//         <form className="sala-filter-form w-4/5 mx-auto md:flex md:flex-row md:space-x-4">
//             <input
//                 type="text"
//                 name="nombre"
//                 placeholder="Nombre de la sala"
//                 value={filters.nombre}
//                 onChange={handleChange}
//                 className="form-input placeholder:text-black"
//             />
//             <select
//                 name="genero"
//                 value={filters.genero}
//                 onChange={handleChange}
//                 className="form-select"
//             >
//                 <option value="">Género</option>
//                 {genres.map((genre) => (
//                     <option key={genre.id} value={genre.id}>
//                         {genre.nombre}
//                     </option>
//                 ))}
//             </select>

//             <select
//                 name="provincia"
//                 value={filters.provincia}
//                 onChange={handleChange}
//                 className="form-select"
//             >
//                 <option value="">Provincia</option>
//                 {provinces.map((province) => (
//                     <option key={province.id} value={province.id}>
//                         {province.provincia}
//                     </option>
//                 ))}
//             </select>
//             <select
//                 name="order"
//                 value={filters.order}
//                 onChange={handleChange}
//                 className="form-select"
//             >
//                 <option value="">Ordenar</option>
//                 <option value="ASC">Puntuación ⬆</option>
//                 <option value="DESC">Puntuación ⬇</option>
//             </select>
//             <button type="button" onClick={handleSearch} className="btn-buscar">
//                 Buscar
//             </button>
//         </form>
//     );
// };

// export default SalaFilter;

import { useState, useEffect } from 'react';
import FetchProvinciasService from '../services/FetchProvinciasService';
import FetchGenresService from '../services/FetchGenresService';

const SalaFilter = ({ onFilterChange }) => {
    const [provinces, setProvinces] = useState([]);
    const [genres, setGenres] = useState([]);
    const [filters, setFilters] = useState({
        nombre: '',
        provincia: '',
        genero: 'Todos', // Valor por defecto como "Todos"
        order: '',
    });

    const [autoSearch, setAutoSearch] = useState(true);

    useEffect(() => {
        const fetchFilters = async () => {
            await FetchProvinciasService(setProvinces);
            await FetchGenresService(setGenres);
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        if (autoSearch) {
            onFilterChange(filters);
        }
    }, [filters, onFilterChange, autoSearch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
        setAutoSearch(true);
    };

    const handleSearch = () => {
        setAutoSearch(false);
        onFilterChange(filters);
    };

    return (
        <form className="sala-filter-form w-4/5 mx-auto md:flex md:flex-row md:space-x-4">
            <input
                type="text"
                name="nombre"
                placeholder="Nombre de la sala"
                value={filters.nombre}
                onChange={handleChange}
                className="form-input placeholder:text-black"
            />
            <select
                name="genero"
                value={filters.genero}
                onChange={handleChange}
                className="form-select"
            >
                <option value="Todos">Todos</option> {/* Cambio aquí */}
                {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                        {genre.nombre}
                    </option>
                ))}
            </select>

            <select
                name="provincia"
                value={filters.provincia}
                onChange={handleChange}
                className="form-select"
            >
                <option value="">Provincia</option>
                {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                        {province.provincia}
                    </option>
                ))}
            </select>
            <select
                name="order"
                value={filters.order}
                onChange={handleChange}
                className="form-select"
            >
                <option value="">Ordenar</option>
                <option value="ASC">Puntuación ⬆</option>
                <option value="DESC">Puntuación ⬇</option>
            </select>
            <button type="button" onClick={handleSearch} className="btn-buscar">
                Buscar
            </button>
        </form>
    );
};

export default SalaFilter;
