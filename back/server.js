import express from 'express';
import 'dotenv/config';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import morgan from 'morgan';
import routes from './src/routes/index.js';
import { startScheduledJobs } from './src/jobs/scheduledJobs.js';
import { PORT, UPLOADS_DIR, URL_FRONT, PRERENDER_TOKEN } from './env.js';
import prerender from 'prerender-node';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Confía en el proxy inverso (Nginx) para obtener el protocolo correcto
app.enable('trust proxy');

// 🧠 Soporte para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⚙️ PRERENDER.IO para bots
if (PRERENDER_TOKEN) {
    console.log('✅ Token de Prerender cargado:', PRERENDER_TOKEN);

    prerender.set('prerenderToken', PRERENDER_TOKEN);
    prerender.set('protocol', 'https');

    // ➕ Logging para depurar
    prerender.set('beforeRender', (req, done) => {
        console.log('🧪 Revisando User-Agent:', req.headers['user-agent']);
        done();
    });

    app.use(prerender);
    console.log('📦 prerender-node middleware cargado.');
}

// 📋 Logs, parsing, uploads
app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload());

// 🔐 CORS (relajado para bots sin Origin)
const allowedOrigins = [URL_FRONT];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS Error: Origin '${origin}' no permitido. Permitidos: ${allowedOrigins.join(', ')}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

// 📁 Servir archivos estáticos del frontend compilado (desde front/dist)
// La carpeta 'front/dist' contendrá index.html, assets (js, css), favicons, etc.
app.use(express.static(path.join(__dirname, '../front/dist')));

// 📁 Archivos estáticos de frontend (solo assets y favicons) - COMENTADAS PORQUE AHORA SE SIRVEN DESDE front/dist
// app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
// app.use('/favicon.svg', express.static(path.join(__dirname, 'public/favicon.svg')));
// app.use('/favicon-32x32.png', express.static(path.join(__dirname, 'public/favicon-32x32.png')));
// app.use('/apple-touch-icon.png', express.static(path.join(__dirname, 'public/apple-touch-icon.png')));

// 📂 Archivos subidos
// Se elimina el logger personalizado temporalmente para aislar el problema de express.static
app.use('/api/uploads', express.static(path.join(__dirname, UPLOADS_DIR)));

// RUTA DE PRUEBA AÑADIDA
app.get('/testapi', (req, res) => {
    console.log(`Accedido /testapi desde origin: ${req.headers.origin}, UA: ${req.headers['user-agent']}`);
    res.json({ message: 'Test API alcanzada correctamente' });
});

// REGISTRO ANTES DE RUTAS API AÑADIDO
app.use((req, res, next) => {
    console.log(`Intentando ruta API: ${req.method} ${req.originalUrl} desde origin: ${req.headers.origin}, UA: ${req.headers['user-agent']}`);
    next();
});

// 🚀 Rutas API
app.use('/api', routes); // Corregido: '/api' prefijo añadido

// REGISTRO ANTES DE SPA COMODÍN AÑADIDO
app.use((req, res, next) => {
    console.log(`Ruta API no coincidió (${req.method} ${req.originalUrl}), cayendo a SPA.`);
    next();
});

// 🌍 SPA React (solo si no coincide nada más)
// Ahora debe servir el index.html desde front/dist
app.get('*', (req, res) => {
    console.log(`Sirviendo SPA para: ${req.method} ${req.originalUrl}`);
    res.sendFile(path.join(__dirname, '../front/dist/index.html'));
});

// 🛑 Error handler global
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.httpStatus || 500).send({
        status: 'error',
        message: err.message,
    });
});

// 🕒 Jobs programados
startScheduledJobs();

// 🎧 Server ON
app.listen(PORT, () => {
    console.log(`Server on ${PORT}`);
});