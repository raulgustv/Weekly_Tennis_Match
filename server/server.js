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
import './jobs/matchStatus.js'
import { globalLimiter } from './config/expressLimit.js';
import helmet from 'helmet'




//aplicación
const app = express();

//render y proxies
app.set('trust_proxy', 1)


//Middleware
app.use(globalLimiter)
const allowedOrigins = [
  "http://localhost:3000",
  "https://weekly-tennis-match.vercel.app",
  "https://www.madridtenniscommunity.es"
];

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
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet())


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

//Conexión
const PORT = process.env.PORT || 7000;

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
});