import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAgencia from '../../hooks/useAgencia.jsx';
import DefaultProfile from '/Horizontal_blanco.webp';
import useAuth from '../../hooks/useAuth.jsx';
import Seo from '../SEO/Seo.jsx';
import TextFormat from '../TextFormato.jsx';
import usePrevNext from '../../hooks/usePrevNext.jsx';
import NextPreviousItem from '../Elements/NextPreviousItem.jsx';
import EditPublishItemAdmin from '../Admin/EditPublishItemAdmin.jsx';

const AgenciaDetails = () => {
    const { VITE_API_URL_BASE } = import.meta.env;
    const { idAgencia } = useParams();
    const { agencia } = useAgencia(idAgencia);
    const { currentUser, token } = useAuth();
    const [actualUser, setActualUser] = useState('');

    const {
        nombre = '',
        provincia = '',
        descripcion = '',
        web = '',
        agenciaEspecialidad = [],
        email = '',
        published = 0,
        avatar = '',
    } = agencia || {};

    const grupos = agencia?.gruposPhotos || [];
    const roles = 'agencia';
    const { previous, next } = usePrevNext({ idItem: idAgencia, roles });

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

    const imageUrl = avatar
        ? `${VITE_API_URL_BASE}/uploads/${avatar}`
        : DefaultProfile;

    return published === 1 || actualUser.roles === 'admin' ? (
        <>
            <Seo
                title={`${nombre} - Agencia de músicos en ${provincia}`}
                description={`Descubre la agencia ${nombre} en ${provincia}. ${
                    descripcion
                        ? descripcion.length > 160
                            ? descripcion.slice(0, 157).trim() + '...'
                            : descripcion
                        : 'Conoce más sobre la agencia.'
                }`}
                keywords={`agencia, manager, ${nombre}, ${provincia}, música en vivo, eventos`}
                url={`https://oiches.com/agencia/${idAgencia}`}
                image={imageUrl}
                imageAlt={`Imagen de la agencia ${nombre}`}
            />

            <main className="p-4 mt-6 flex flex-col gap-6 mx-auto shadow-xl w-11/12 md:max-w-1200 md:px-24">
                {/* Información de la agencia */}
                <section className="mb-6">
                    {avatar && (
                        <img
                            className="w-40 h-40 rounded-full object-cover shadow-lg mx-auto md:ml-0"
                            src={imageUrl}
                            alt={`Imagen de perfil de la ${nombre}`}
                        />
                    )}
                    <h2 className="text-3xl font-bold mt-6 text-left mb-2">
                        {nombre}
                    </h2>

                    <ul className="flex flex-wrap">
                        {agenciaEspecialidad.map((espc, index) => (
                            <li key={espc.idEspecialidad} className="mb-0">
                                {espc.especialidad}
                                {index < agenciaEspecialidad.length - 1 && (
                                    <span>,&nbsp;</span>
                                )}
                            </li>
                        ))}
                    </ul>

                    <p className="text-black">{provincia}</p>

                    <div className="flex flex-wrap mb-4">
                        {actualUser.roles === 'grupo' && (
                            <a
                                href={`mailto:${email}`}
                                className="button-large px-4 m-auto md:mr-0"
                            >
                                Contactar
                            </a>
                        )}
                    </div>
                    {descripcion && (
                        <div className="py-4">
                            <TextFormat text={descripcion} />
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
                </section>

                {/* Roster - Tarjetas de Grupos (Nuevo Diseño) */}
                {grupos && grupos.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-2xl font-bold text-center md:text-left">
                            Roster
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 mt-8">
                            {grupos.map((grupo) => (
                                <li
                                    key={grupo.id}
                                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105 overflow-hidden flex items-center p-4 gap-4 border-b-2 border-moradoOiches"
                                >
                                    {/* Imagen Redonda */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                                        <img
                                            src={
                                                grupo.fotos.length > 0
                                                    ? `${VITE_API_URL_BASE}/uploads/${grupo.fotos[0].name}`
                                                    : imageUrl
                                            }
                                            alt={`Imagen de ${grupo.nombre}`}
                                            className="object-cover w-full h-full rounded-full shadow-lg"
                                        />
                                    </div>

                                    {/* Información */}
                                    <div className="flex-1">
                                        <h3 className=" font-semibold text-footercolor mb-2">
                                            {grupo.nombre}
                                        </h3>
                                        {/* Botón de más información */}
                                        <Link
                                            to={`/grupo/${grupo.id}`}
                                            className="mt-2 inline-block bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                                        >
                                            + Info
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <NextPreviousItem
                    previous={previous}
                    next={next}
                    roles={roles}
                />

                {actualUser.roles === 'admin' && (
                    <div>
                        <EditPublishItemAdmin
                            idItem={idAgencia}
                            token={token}
                            published={published}
                            roles={roles}
                        />
                    </div>
                )}
            </main>
        </>
    ) : (
        <p className="text-center mt-12">La agencia aún no está publicada</p>
    );
};

export default AgenciaDetails;
