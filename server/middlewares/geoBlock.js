// middlewares/geoBlock.js
import geoip from 'geoip-lite';
import { EUROPEAN_COUNTRIES, BLOCKED_COUNTRIES } from '../utils/blockedCountries.js';

export const geoBlock = (req, res, next) => {
  const ip = (req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '').replace('::ffff:', '');
  const geo = geoip.lookup(ip);
  const country = geo?.country;

  if (country && country !== 'ES') {
    console.log(`[fuera de España] country=${country} ip=${ip} path=${req.originalUrl}`);
  }

  if (!geo) return next();

  if (BLOCKED_COUNTRIES.includes(country)) {
    return res.status(403).json({ error: 'GEO_BLOCKED', message: 'This service is not available in your region' });
  }

  if (!EUROPEAN_COUNTRIES.includes(country)) {
    return res.status(403).json({ error: 'GEO_BLOCKED', message: 'This service is not available in your region' });
  }

  next();
};