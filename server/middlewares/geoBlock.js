// middlewares/geoBlock.js
import geoip from 'geoip-lite';
import { BLOCKED_COUNTRIES, EU_CONTINENT_CODE } from '../utils/blockedCountries.js';

export const geoBlock = (req, res, next) => {
  // Render pone la IP real del cliente en x-forwarded-for
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;

  const geo = geoip.lookup(ip);
  const country = geo?.country;   // ej "ES"
  const continent = geo?.continent; // ej "EU"

  if (country && country !== 'ES') {
    console.log(`[fuera de España] country=${country} ip=${ip} path=${req.originalUrl}`);
  }

  if (!geo) return next(); // sin datos de geo (ej. IP local en dev), dejamos pasar

  if (BLOCKED_COUNTRIES.includes(country)) {
    return res.status(403).json({ error: 'GEO_BLOCKED', message: 'Este servicio no está disponible en tu región.' });
  }

  if (continent !== EU_CONTINENT_CODE) {
    return res.status(403).json({ error: 'GEO_BLOCKED', message: 'Este servicio no está disponible en tu región.' });
  }

  next();
};