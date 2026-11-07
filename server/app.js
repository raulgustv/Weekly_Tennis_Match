import dotenv from 'dotenv'
dotenv.config();
import express from 'express'

import cors from 'cors'
import morgan from 'morgan'
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
import seasonRoutes from './routes/season.js'
import rankingRoutes from './routes/ranking.js'
import rankingPenaltyRoutes from './routes/rankingPenalty.js'
import { globalLimiter } from './config/expressLimit.js';
import helmet from 'helmet'
import cookieParser from 'cookie-parser';

const app = express();

app.set('trust proxy', 1)

const allowedOrigins = [
  process.env.ALLOWED_ORIGIN_LOCAL,
  process.env.ALLOWED_ORIGIN_MAIN
];

app.use(cookieParser())
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));
app.use(globalLimiter)
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/location', locationRoutes)
app.use('/api/match', matchRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/vote', skillRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/season', seasonRoutes)
app.use('/api/ranking', rankingRoutes)
app.use('/api/ranking-penalty', rankingPenaltyRoutes)
app.use('/api/notification', notificationRoutes)
app.use('/api/notifications', userNotificationRoutes)

export default app;