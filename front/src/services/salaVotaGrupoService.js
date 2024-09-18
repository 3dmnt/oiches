import apiRequest from '../utils/apiRequest';

const salaVotaGrupoService = async ({ data, idReserva, token }) => {
    const { VITE_API_URL_BASE } = import.meta.env;
    const url = `${VITE_API_URL_BASE}/grupos/${idReserva}/votes`;

    return apiRequest({
        url,
        method: 'POST',
        headers: {
            authorization: token,
        },
        body: data,
    });
};

export default salaVotaGrupoService;
