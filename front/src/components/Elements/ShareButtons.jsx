import React from 'react';
import { FaWhatsapp, FaTwitter, FaFacebook, FaLinkedin, FaCopy, FaShareAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ShareButtons = ({ url, title, description = '', image = '', size = 'md' }) => {
    // Usar la variable de entorno para la URL base
    const appBaseUrl = import.meta.env.VITE_APP_URL || 'https://testoiches.es';
    
    // Asegurarse de que la URL sea absoluta
    const fullUrl = url.startsWith('http') ? url : `${appBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    
    // Asegurarse de que la imagen sea absoluta (para redes sociales que lo soportan directamente)
    // Nota: La mayoría de las redes sociales usarán los metadatos Open Graph de la página
    const fullImageUrl = image ? (image.startsWith('http') ? image : `${appBaseUrl}${image.startsWith('/') ? '' : '/'}${image}`) : '';
    
    // Textos predefinidos para compartir
    const shareText = `${title}${description ? ` - ${description.slice(0, 80)}...` : ''}`;
    
    // Definir tamaños de botones
    const sizes = {
        sm: 'text-lg p-2',
        md: 'text-xl p-2',
        lg: 'text-2xl p-3'
    };
    
    const buttonSize = sizes[size] || sizes.md;
    
    // Función para copiar el enlace
    const copyToClipboard = () => {
        navigator.clipboard.writeText(fullUrl).then(() => {
            toast.success('Enlace copiado al portapapeles');
        }).catch(() => {
            toast.error('No se pudo copiar el enlace');
        });
    };
    
    // Enlaces para compartir
    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: <FaWhatsapp className="text-green-500" />,
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${fullUrl}`)}`
        },
        {
            name: 'Twitter',
            icon: <FaTwitter className="text-blue-400" />,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}&via=oiches_musica${fullImageUrl ? `&picture=${encodeURIComponent(fullImageUrl)}` : ''}`
        },
        {
            name: 'Facebook',
            icon: <FaFacebook className="text-blue-600" />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}&quote=${encodeURIComponent(shareText)}`
            // Facebook usa Open Graph para las imágenes, no se puede forzar con un parámetro
        },
        {
            name: 'LinkedIn',
            icon: <FaLinkedin className="text-blue-700" />,
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`
            // LinkedIn también usa Open Graph para las imágenes, pero acepta algunos parámetros extra
        }
    ];
    
    return (
        <div className="flex flex-wrap gap-1 items-center">
            <div className="mr-1 flex items-center">
                <FaShareAlt className="mr-1" /> Compartir:
            </div>
            <div className="flex flex-wrap gap-1">
                {shareLinks.map((link) => (
                    <button
                        key={link.name}
                        onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                        className={`${buttonSize} rounded-full hover:bg-gray-100 transition duration-300 ease-in-out flex items-center justify-center shadow-sm`}
                        aria-label={`Compartir en ${link.name}`}
                        title={`Compartir en ${link.name}`}
                    >
                        {link.icon}
                    </button>
                ))}
                <button
                    onClick={copyToClipboard}
                    className={`${buttonSize} rounded-full hover:bg-gray-100 transition duration-300 ease-in-out flex items-center justify-center shadow-sm`}
                    aria-label="Copiar enlace"
                    title="Copiar enlace"
                >
                    <FaCopy className="text-gray-600" />
                </button>
            </div>
        </div>
    );
};

export default ShareButtons;
