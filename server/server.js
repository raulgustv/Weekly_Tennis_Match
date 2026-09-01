import dotenv from 'dotenv'
//Enviroment
dotenv.config();
import express from 'express'

import cors from 'cors'
import morgan from 'morgan'
import connectDB from './config/db.js';
import userRoutes from './routes/user.js';
import locationRoutes from './routes/location.js';
import matchRoutes from './routes/match.js';
import profileRoutes from './routes/profile.js';
import skillRoutes from './routes/skill.js';
import adminRoutes from './routes/admin.js';
import walletRoutes from './routes/wallet.js';
import feedbackRoutes from './routes/feedback.js'
import notificationRoutes from './routes/notification.js'
import userNotificationRoutes from './routes/userNotification.js'
import './jobs/matchStatus.js'
import { globalLimiter } from './config/expressLimit.js';
import helmet from 'helmet'
import cookieParser from 'cookie-parser';
import { geoBlock } from './middlewares/geoBlock.js';




//aplicación
const app = express();

//render y proxies
// 🔧 FIX (logout bug): la clave correcta en Express es 'trust proxy' (con
// espacio), NO 'trust_proxy' (con guion bajo). Tal y como estaba, Express no
// reconocía la opción y la línea no hacía nada: req.ip seguía devolviendo la
// IP interna del proxy de Render en vez de la IP real de cada usuario.
//
// Esto es grave porque varios rate limiters (globalLimiter, readLimiter,
// writeLimiter, refreshLimiter...) usan req.ip como parte de su clave por
// defecto. Con la clave mal escrita, TODAS las peticiones de TODO el grupo
// social parecían venir "de la misma IP" (la del proxy), así que en la
// práctica compartíais un único contador de refresh (60 cada 15 min) entre
// todos los usuarios de la app a la vez. Con el grupo jugando, refrescando el
// access token cada 15 min y con el sondeo en segundo plano, era fácil agotar
// ese contador compartido: el refresh de un usuario cualquiera devolvía 429
// ("Too many refresh attempts"), el frontend lo trataba como sesión inválida,
// y esa persona era expulsada al login sin haber hecho nada raro.
//
// Con esto corregido, cada usuario tiene su propio contador otra vez.
app.set('trust proxy', 1)


//Middleware
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN_LOCAL,
  process.env.ALLOWED_ORIGIN_MAIN
];

app.use(cookieParser())
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // permite Postman / mobile
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));
app.use(geoBlock)
app.use(globalLimiter)
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());


//DB
connectDB()

//rutas
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/location', locationRoutes)
app.use('/api/match', matchRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/vote', skillRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/notification', notificationRoutes)
app.use('/api/notifications', userNotificationRoutes)

//Conexión
const PORT = process.env.PORT || 7000;

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
});