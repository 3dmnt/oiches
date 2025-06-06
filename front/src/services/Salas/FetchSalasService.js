import apiRequest from '../../utils/apiRequest';

const FetchSalasService = async (filters = {}, page = 1, pageSize = 10) => {
    try {
        // Crear un nuevo objeto con los filtros que tienen valores
        const queryParamsObj = {
            page,
            limit: pageSize,
        };

        if (filters.nombre) queryParamsObj.nombre = filters.nombre;
        if (filters.provincia) queryParamsObj.provincia = filters.provincia;

        // Agregar lógica: Si 'Todos' está seleccionado, no se pasa el filtro de géneros
        if (filters.genero && filters.genero !== 'Todos') {
            queryParamsObj.genero = filters.genero; // Aquí usamos singular para que coincida con la API
        }

        if (filters.order) queryParamsObj.order = filters.order;

        const queryParams = new URLSearchParams(queryParamsObj).toString();
        const url = `${import.meta.env.VITE_API_URL_BASE}/salas?${queryParams}`;
        const data = await apiRequest({ url });

        return data;
    } catch (error) {
        console.error('Hubo un error al obtener las salas:', error);
        return { total: 0, rows: [] }; // Devolver el formato correcto incluso en caso de error
    }
};

export default FetchSalasService;
