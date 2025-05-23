import { Helmet } from 'react-helmet-async';
import { useMemo } from 'react';

const Seo = ({
    title = 'Oiches - Conecta Músicos y Salas de Conciertos',
    description = 'Descubre los músicos mejor valorados y las salas de conciertos más populares en Oiches. Vive la mejor música en vivo y organiza eventos musicales inolvidables.',
    keywords = 'músicos, salas de conciertos, música en vivo, eventos musicales',
    url, // Eliminamos el valor por defecto problemático aquí
    image, // Eliminamos el valor por defecto problemático aquí
    imageAlt = 'Oiches - Conectamos músicos y salas',
    type = 'website',
    noIndex = false,
    structuredData = null,
}) => {
    const appBaseUrl = import.meta.env.VITE_APP_URL || 'https://testoiches.es'; // Fallback por si no está definida
    const pageUrl = url ? `${appBaseUrl}${url.startsWith('/') ? url : '/' + url}` : appBaseUrl;
    const imageUrl = image ? (image.startsWith('http') ? image : `${appBaseUrl}${image.startsWith('/') ? image : '/' + image}`) : `${appBaseUrl}/Oiches-Conectamos-musicos-y-salasRRSS.jpg`;

    // 📌 Datos estructurados básicos para SEO y Google
    const commonStructuredData = useMemo(
        () => [
            {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Oiches',
                alternateName: 'Oiches Música y Conciertos',
                url: pageUrl,
                logo: `${appBaseUrl}/Oiches-logo-vertical.png`,
                description: description,
                sameAs: [
                    'https://www.instagram.com/oiches_musica/',
                    'https://www.facebook.com/oiches/',
                ],
            },
            {
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: title,
                description: description,
                url: pageUrl,
                image: imageUrl,
                publisher: {
                    '@type': 'Organization',
                    name: 'Oiches',
                    logo: {
                        '@type': 'ImageObject',
                        url: `${appBaseUrl}/logo.png`,
                    },
                },
            },
        ],
        [title, description, pageUrl, imageUrl, appBaseUrl] // appBaseUrl añadido a las dependencias
    );

    return (
        <Helmet>
            {/* Idioma del documento */}
            <html lang="es" />

            {/* 🔹 Etiquetas SEO */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta
                name="robots"
                content={noIndex ? 'noindex, nofollow' : 'index, follow'}
            />
            <link rel="canonical" href={pageUrl} />

            {/* 🔹 Open Graph (Facebook, WhatsApp) */}
            <meta property="og:site_name" content="Oiches" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:alt" content={imageAlt || title} />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:locale" content="es_ES" />
            <meta property="og:site_name" content="Oiches" />
            <meta property="fb:app_id" content="1379070373382189" />

            {/* 🔹 Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
            <meta name="twitter:site" content="@oiches_musica" />

            {/* 🔹 Datos estructurados básicos */}
            {commonStructuredData.map((data, index) => (
                <script
                    key={`common-structured-data-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
                />
            ))}

            {/* 🔹 Datos estructurados dinámicos */}
            {structuredData && typeof structuredData === 'object' && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData, null, 2),
                    }}
                />
            )}
        </Helmet>
    );
};

export default Seo;
