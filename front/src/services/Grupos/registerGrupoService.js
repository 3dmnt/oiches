import apiRequest from '../../utils/apiRequest';

const registerGrupoService = async ({ token, userId, formData }) => {
    const url = `${import.meta.env.VITE_API_URL_BASE}/users/grupo/${userId}`;

    const response = await apiRequest({
        url,
        method: 'POST',
        headers: {
            authorization: token,
        },
        body: formData,
    });

    return response.data;
};

export default registerGrupoService;
