import { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/auth/auth.context.jsx';
import salaVotaGrupoService from '../../services/Salas/salaVotaGrupoService.js';

const SalaVotaGrupo = ({ idReserva, idSala, idGrupo }) => {
    const { token, userLogged } = useContext(AuthContext);
    const { VITE_API_URL_BASE } = import.meta.env;

    const [voto, setVoto] = useState(0);
    const [hoverVoto, setHoverVoto] = useState(0);
    const [comment, setComment] = useState('');
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        const fetchVotos = async () => {
            try {
                const url = `${VITE_API_URL_BASE}/salas/votos/${idSala}`;

                const response = await fetch(url);
                const votosData = await response.json();

                const votoExistente = votosData.data.salaVotos.find(
                    (voto) =>
                        voto.reservaId === idReserva ||
                        voto.grupoVotado === idGrupo
                );

                if (votoExistente) {
                    setHasVoted(true);
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchVotos();
    }, [VITE_API_URL_BASE, idGrupo, idReserva, idSala]);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            const data = new FormData();
            data.append('voto', voto);
            data.append('comment', comment);

            await salaVotaGrupoService({ data, idReserva, token });

            toast.success('Tu voto ha sido publicado');
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (!userLogged || userLogged.roles !== 'sala') {
        return null;
    }

    if (hasVoted) {
        return (
            <p className="text-center text-yellowOiches font-semibold">
                Ya has votado a este artista/grupo
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <h2 className="text-lg font-semibold mb-2">
                Comenta tu experiencia
            </h2>
            <div className="mb-2 flex items-center">
                <label className="font-semibold mr-3 md:mr-4">
                    Puntuación:
                </label>
                <div className="flex">
                    {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                            <span
                                key={ratingValue}
                                onClick={() => setVoto(ratingValue)}
                                onMouseEnter={() => setHoverVoto(ratingValue)}
                                onMouseLeave={() => setHoverVoto(0)}
                                style={{
                                    cursor: 'pointer',
                                    marginRight: '.4rem',
                                    color:
                                        ratingValue <= (hoverVoto || voto)
                                            ? '#ffb500'
                                            : 'lightgray',
                                    fontSize: '1.9rem',
                                }}
                            >
                                &#9834;
                            </span>
                        );
                    })}
                </div>
            </div>
            <div>
                <label className="font-semibold">Comentario:</label>
                <textarea
                    name="comment"
                    onChange={(e) => setComment(e.target.value)}
                    className="form-textarea md:min-h-20"
                ></textarea>
            </div>
            <div className="mt-3 max-w-56">
                <input
                    type="submit"
                    value="Votar"
                    className="btn-account p-3 w-full"
                />
            </div>
        </form>
    );
};
export default SalaVotaGrupo;
