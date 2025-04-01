import { useState, useEffect } from 'react';
import Toastify from '../Toastify.jsx';
import { toast } from 'react-toastify';
import FetchProvinciasService from '../../services/FetchProvinciasService.js';
import getAgenciaService from '../../services/Agencias/getAgenciaService.js';
import EditAgenciaService from '../../services/Agencias/EditAgenciaService.js';
import { FaEye } from 'react-icons/fa';

const AgenciaEdit = ({ userLogged, token, idAgencia }) => {
    const [agencia, setAgencia] = useState({
        nombre: '',
        provincia: '',
        descripcion: '',
        web: '',
    });

    const [provinces, setProvinces] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        FetchProvinciasService(setProvinces);
    }, []);

    useEffect(() => {
        const fetchAgencia = async () => {
            try {
                const { data } = await getAgenciaService(idAgencia);

                setAgencia({
                    nombre: data.agencia.nombre || '',
                    provincia: data.agencia.provinciaId || '',
                    descripcion: data.agencia.descripcion || '',
                    web: data.agencia.web || '',
                    owner: data.agencia.usuario_id,
                });
            } catch (error) {
                setError(error.message);
                toast.error(error.message);
            }
        };

        fetchAgencia();
    }, [idAgencia]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataForm = new FormData();
            dataForm.append('nombre', agencia.nombre || '');
            dataForm.append('provincia', agencia.provincia || '');
            dataForm.append('descripcion', agencia.descripcion || '');
            dataForm.append('web', agencia.web || '');

            await EditAgenciaService({
                token,
                idAgencia,
                dataForm,
            });

            toast.success('Has modificado tu agencia con éxito');
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        }
    };

    return (userLogged && agencia.owner === userLogged.id) ||
        (userLogged && userLogged.roles === 'admin') ? (
        <>
            <div className="max-w-full mx-auto">
                <h3 className="text-xl font-semibold text-center mb-6">
                    Editar Agencia
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Agrupamos los 3 primeros campos en una fila */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Nombre */}
                        <div className="w-full">
                            <label
                                htmlFor="nombre"
                                className="block font-semibold mb-1"
                            >
                                Nombre de la agencia:
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre de la agencia"
                                value={agencia.nombre}
                                onChange={(e) =>
                                    setAgencia({
                                        ...agencia,
                                        nombre: e.target.value,
                                    })
                                }
                                className="form-input w-full"
                            />
                        </div>

                        {/* Provincia */}
                        <div className="w-full">
                            <label
                                htmlFor="provincia"
                                className="block font-semibold mb-1"
                            >
                                Provincia:
                            </label>
                            <select
                                name="provincia"
                                value={agencia.provincia}
                                className="form-input w-full py-2 h-auto"
                                onChange={(e) =>
                                    setAgencia({
                                        ...agencia,
                                        provincia: e.target.value,
                                    })
                                }
                            >
                                <option value="">
                                    Selecciona una provincia
                                </option>
                                {provinces.map((province) => (
                                    <option
                                        key={province.id}
                                        value={province.id}
                                    >
                                        {province.provincia}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Web */}
                        <div className="w-full">
                            <label
                                htmlFor="web"
                                className="block font-semibold mb-1"
                            >
                                Web o enlace a tus RRSS:
                            </label>
                            <input
                                type="url"
                                name="web"
                                placeholder="https://www.tuagencia.com"
                                value={agencia.web}
                                className="form-input w-full"
                                onChange={(e) =>
                                    setAgencia({
                                        ...agencia,
                                        web: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* Descripción - Se coloca en una fila aparte */}
                    <div className="w-full">
                        <label
                            htmlFor="descripcion"
                            className="block font-semibold mb-1"
                        >
                            Descripción:
                        </label>
                        <textarea
                            name="descripcion"
                            value={agencia.descripcion}
                            onChange={(e) =>
                                setAgencia({
                                    ...agencia,
                                    descripcion: e.target.value,
                                })
                            }
                            className="form-input w-full min-h-[8rem]" // Altura mínima de 8 líneas
                        ></textarea>
                        <p className="mt-1 text-gray-500 text-sm">
                            2000 caracteres como máximo
                        </p>
                    </div>

                    {/* Botones en una sola línea alineados a la izquierda */}
                    <div className="flex flex-wrap items-center gap-8 justify-start pt-6">
                        {/* Botón de Modificar datos */}
                        <input
                            type="submit"
                            value="Modificar datos"
                            className="btn-degradado"
                        />

                        {/* Enlace para Ver la Agencia */}
                        <a
                            href={`/agencia/${idAgencia}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline focus:outline focus:ring-2 focus:ring-purple-600 flex items-center gap-2"
                        >
                            <FaEye className="text-base" />
                            <span>Ver Agencia</span>
                        </a>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <p className="text-red-500 text-center">{error}</p>
                    )}
                </form>
            </div>
            <Toastify />
        </>
    ) : (
        <h1 className="text-center text-xl">No puedes acceder a esta página</h1>
    );
};

export default AgenciaEdit;
