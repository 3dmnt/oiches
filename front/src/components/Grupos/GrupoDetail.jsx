import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { FaPencilAlt } from 'react-icons/fa';

import useGrupo from '../../hooks/useGrupo.jsx';
import StarRating from '../StartRating.jsx';
import Header from '../Header.jsx';
import DefaultProfile from '/DefaultProfile2.png';
import useAuth from '../../hooks/useAuth.jsx';
import Footer from '../Footer.jsx';
import Seo from '../SEO/Seo.jsx'; // Importamos el componente Seo
import TextFormat from '../TextFormato.jsx'; // Importamos el componente TextFormat
import { IoChevronForward } from 'react-icons/io5';
import { IoChevronBack } from 'react-icons/io5';

const GrupoDetail = () => {
    const { VITE_API_URL_BASE } = import.meta.env;
    const { idGrupo } = useParams();
    const { currentUser } = useAuth();
    const { entry, error } = useGrupo(idGrupo);
    const [actualUser, setActualUser] = useState('');
    const [previous, setPrevious] = useState('');
    const [next, setNext] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                `${VITE_API_URL_BASE}/grupos?pageSize=300`
            );
            const data = await response.json();

            const sortedGrups = Array.isArray(data.rows)
                ? data.rows.sort(
                      (a, b) => new Date(a.updatedAte) - new Date(b.updatedAte)
                  )
                : [];

            const currentIndex = sortedGrups.findIndex(
                (sala) => sala.id === idGrupo
            );
            if (currentIndex !== -1) {
                const previousSala =
                    currentIndex > 0 ? sortedGrups[currentIndex - 1] : null;
                const nextSala =
                    currentIndex < sortedGrups.length - 1
                        ? sortedGrups[currentIndex + 1]
                        : null;

                setPrevious(previousSala);
                setNext(nextSala);
            }
        };

        fetchData();
    }, [idGrupo, VITE_API_URL_BASE]);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;
            const response = await fetch(
                `${VITE_API_URL_BASE}/users/info/${currentUser.id}`
            );
            const data = await response.json();
            setActualUser(data[0]);
        };
        fetchData();
    }, [currentUser, VITE_API_URL_BASE]);

    const {
        nombre,
        provincia,
        web,
        genero,
        avatar,
        biografia,
        comentarios,
        email,
        fotos,
        honorarios,
        honorarios_to,
        condiciones,
        media,
        pdf,
    } = entry || {}; // Desestructuramos `entry`

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return entry ? (
        <>
            {/* Integración de SEO dinámico con los datos del grupo */}
            <Seo
                title={`${nombre} - Grupo Musical en Oiches`}
                description={`Descubre a ${nombre}, un grupo musical destacado en ${provincia}. Género: ${
                    genero?.map((g) => g.generoName).join(', ') || 'Desconocido'
                }. ${
                    biografia
                        ? biografia
                        : 'Conoce más sobre su música en vivo.'
                }`}
                keywords={`grupo musical, ${nombre}, ${genero
                    ?.map((g) => g.generoName)
                    .join(', ')}, música en vivo, conciertos`}
                url={`https://oiches.com/grupo/${idGrupo}`}
                image={
                    avatar
                        ? `${VITE_API_URL_BASE}/uploads/${avatar}`
                        : DefaultProfile
                }
            />

            <Header />
            <main className="p-4 mt-6 flex flex-col gap-6 mx-auto shadow-xl w-11/12 md:max-w-1200 md:px-24">
                <section className="flex flex-wrap gap-4 py-4">
                    <div>
                        {(avatar || fotos.length > 0) && (
                            <img
                                className="w-40 h-40 rounded-full object-cover shadow-lg mx-auto md:ml-0"
                                src={
                                    avatar
                                        ? `${VITE_API_URL_BASE}/uploads/${avatar}`
                                        : `${VITE_API_URL_BASE}/uploads/${
                                              fotos.find(
                                                  (foto) => foto.main === 1
                                              )?.name || fotos[0]?.name
                                          }`
                                }
                                alt="Imagen de perfil del grupo"
                            />
                        )}

                        <h2 className="text-3xl font-bold mt-4 text-center md:text-left">
                            {nombre}
                        </h2>
                    </div>
                    {actualUser.roles === 'sala' && (
                        <div className="m-auto flex flex-col gap-4 shadow-[0_8px_10px_4px_rgba(0,0,0,0.07)] p-4 items-center rounded-2xl md:mr-0 md:mb-0 md:max-w-80">
                            <p className="text-center">
                                ¿Quieres que {nombre} toque en tu sala?
                            </p>

                            <a
                                href={`mailto:${email}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-purpleOiches to-moradoOiches text-white font-bold py-2 px-4 rounded-lg shadow-lg flex max-w-32 justify-center"
                            >
                                Contactar
                            </a>
                        </div>
                    )}
                </section>

                <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    {biografia && (
                        <div className="md:col-span-4 pb-4">
                            <TextFormat text={biografia} />
                        </div>
                    )}
                    {genero && (
                        <div className="border-t border-gray-300 pt-4">
                            <span className="font-semibold">Géneros</span>
                            <ul className="flex flex-wrap">
                                {genero.map((gen, index) => (
                                    <li key={gen.generoId} className="mb-0">
                                        {gen.generoName}
                                        {index < genero.length - 1 && (
                                            <span>,&nbsp;</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {honorarios > 0 && (
                        <div className="border-t border-gray-300 pt-4">
                            <span className="font-semibold">Caché</span>
                            <p className="text-black">
                                {honorarios}€
                                {honorarios_to > 0
                                    ? ` - ${honorarios_to} €`
                                    : ''}
                            </p>
                        </div>
                    )}

                    {provincia && (
                        <div className="border-t border-gray-300 pt-4">
                            <span className="font-semibold">Provincia</span>
                            <p className="text-black">{provincia}</p>
                        </div>
                    )}
                    {web && (
                        <div className="border-t border-gray-300 pt-4">
                            <span className="font-semibold">Web</span>
                            <p>
                                <a
                                    href={web}
                                    target="_blank"
                                    className="underline"
                                >
                                    Web de {nombre}
                                </a>
                            </p>
                        </div>
                    )}

                    {condiciones && (
                        <div className="border-t border-gray-300 pt-4 md:col-span-4">
                            <span className="font-semibold">Condiciones</span>
                            <TextFormat text={condiciones} />
                        </div>
                    )}
                </section>

                {media.length > 0 && (
                    <section>
                        <h3 className="font-semibold">Videos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
                            {media.map((media) => (
                                <LiteYouTubeEmbed
                                    key={media.id}
                                    id={media.url}
                                    title="YouTube Video"
                                    playlist={false}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {fotos.length > 0 && (
                    <section>
                        <h3 className="font-semibold">Fotos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
                            {fotos.map((photo) => (
                                <img
                                    key={photo.id}
                                    src={`${VITE_API_URL_BASE}/uploads/${photo.name}`}
                                    className="rounded-lg image-shadow max-h-80 object-cover"
                                    alt={nombre}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {pdf.length > 0 && (
                    <section>
                        <h3 className="font-semibold">Rider</h3>
                        <iframe
                            className="my-6 w-full md:w-2/3 h-80 rounded-lg image-shadow"
                            src={`${VITE_API_URL_BASE}/uploads/${pdf[0].name}#zoom=90`}
                            title="PDF Viewer"
                        ></iframe>
                    </section>
                )}

                {comentarios.length > 0 && (
                    <section className="mb-10">
                        <h3 className="font-semibold text-lg">Comentarios</h3>

                        {comentarios.map((comentario) => (
                            <div
                                key={comentario.id}
                                className="my-6 p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        className="w-10 h-10 rounded-full object-cover"
                                        src={
                                            comentario.salaAvatar
                                                ? `${VITE_API_URL_BASE}/uploads/${comentario.salaAvatar}`
                                                : DefaultProfile
                                        }
                                        alt="Avatar sala"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">
                                            {comentario.salaVotaNombre}
                                        </span>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(
                                                comentario.createdAt.slice(
                                                    0,
                                                    10
                                                )
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-1">
                                    <StarRating rating={comentario.voto} />
                                </div>

                                <p className="text-sm text-gray-700">
                                    {comentario.comentario}
                                </p>

                                <Link
                                    className="flex justify-end items-center gap-2 mt-3"
                                    to={`/sala/${comentario.salaVotaId}`}
                                >
                                    <img
                                        className="w-8 rounded-full"
                                        src={
                                            comentario.salaAvatar
                                                ? `${VITE_API_URL_BASE}/uploads/${comentario.salaAvatar}`
                                                : DefaultProfile
                                        }
                                        alt="Avatar sala"
                                    />
                                    <p className="italic text-sm text-gray-500">
                                        {comentario.salaVotaNombre}
                                    </p>
                                </Link>
                            </div>
                        ))}
                    </section>
                )}
                <section className="flex justify-between mt-8 mb-16">
                    {previous && (
                        <Link
                            to={`/grupo/${previous.id}`}
                            className="text-purpleOiches hover:text-white"
                        >
                            <button className="p-2 rounded-lg border border-purpleOiches hover:bg-purpleOiches flex items-end">
                                <IoChevronBack className=" border-purpleOiches hover:bg-purpleOiches text-xl" />{' '}
                                Anterior
                            </button>
                        </Link>
                    )}
                    {next && (
                        <Link
                            to={`/grupo/${next.id}`}
                            className="text-purpleOiches hover:text-white ml-auto"
                        >
                            <button className="p-2 rounded-lg border border-purpleOiches hover:bg-purpleOiches flex items-end">
                                Siguiente{' '}
                                <IoChevronForward className=" border-purpleOiches hover:bg-purpleOiches text-xl" />
                            </button>
                        </Link>
                    )}
                </section>

                {actualUser.roles === 'admin' && (
                    <a
                        href={`/grupos/${idGrupo}/edit`}
                        className="flex justify-end gap-4 mb-16"
                    >
                        <FaPencilAlt className=" text-2xl" />
                        Editar
                    </a>
                )}
            </main>
            <Footer />
        </>
    ) : (
        <p>{error}</p>
    );
};

export default GrupoDetail;
