import cron from 'node-cron';
import Match from '../models/Match.js';

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    console.log('Cron running at:', now.toISOString());

    /*
      ==========================================
      READY → PLAYING
      ==========================================
    */
    const readyMatches = await Match.find({ status: 'Ready' });

    for (const match of readyMatches) {
      if (!match.date || !match.startTime) continue;

      const startDate = new Date(match.date);
      const [h, m] = match.startTime.split(':');

      startDate.setHours(Number(h), Number(m), 0, 0);

      if (now >= startDate) {
        match.status = 'Playing';
        await match.save();
        console.log(`${match._id} → Playing`);
      }
    }

    /*
      ==========================================
      PLAYING → PLAYED
      ==========================================
    */
    const playingMatches = await Match.find({ status: 'Playing' });

    for (const match of playingMatches) {
      if (!match.date || !match.endTime) continue;

      const endDate = new Date(match.date);
      const [h, m] = match.endTime.split(':');

      endDate.setHours(Number(h), Number(m), 0, 0);

      if (now >= endDate) {
        match.status = 'Played';
        await match.save();
        console.log(`${match._id} → Played`);
      }
    }

    /*
      ==========================================
      PLAYED → CLOSED (48h después)
      ==========================================
    */
    const playedMatches = await Match.find({ status: 'Played' });

    for (const match of playedMatches) {
      if (!match.date || !match.endTime) continue;

      const endDate = new Date(match.date);
      const [h, m] = match.endTime.split(':');

      endDate.setHours(Number(h), Number(m), 0, 0);

      const closeDate = new Date(endDate.getTime() + 48 * 60 * 60 * 1000);

      if (now >= closeDate) {
        match.status = 'Closed';
        await match.save();
        console.log(`${match._id} → Closed`);
      }
    }

  } catch (error) {
    console.error('Cron error:', error);
  }
});