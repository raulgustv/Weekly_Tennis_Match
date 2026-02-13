import cron from 'node-cron';
import Match from '../models/Match.js';

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();

    console.log('Cron', now.toString());

    // OPEN → PLAYED
    const openMatches = await Match.find({ status: 'Open' });

    for (const match of openMatches) {
      const endDate = new Date(match.date);
      const [h, m] = match.endTime.split(':');
      endDate.setHours(h, m, 0, 0);

      if (now > endDate) {
        console.log(`${match._id} → Played`);
        match.status = 'Played';
        await match.save();
      }
    }

    // PLAYED → CLOSED
    const playedMatches = await Match.find({ status: 'Played' });

    for (const match of playedMatches) {
      const endDate = new Date(match.date);
      const [h, m] = match.endTime.split(':');
      endDate.setHours(h, m, 0, 0);

      const closeDate = new Date(endDate.getTime() + 48 * 60 * 60 * 1000);

      if (now > closeDate) {
        console.log(`${match._id} → Closed`);
        match.status = 'Closed';
        await match.save();
      }
    }

  } catch (error) {
    console.error('Cron error', error);
  }
});
