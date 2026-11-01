import dotenv from 'dotenv'
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';
import './jobs/matchStatus.js'
import './jobs/MatchNotifications.js'
import './jobs/rankingRounds.js'
import './jobs/RankingReminders.js'

connectDB()

const PORT = process.env.PORT || 7000;

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
});
