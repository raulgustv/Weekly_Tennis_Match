// middlewares/geoBlock.js
import geoip from 'geoip-lite';
import { EUROPEAN_COUNTRIES, BLOCKED_COUNTRIES } from '../utils/blockedCountries.js';
// Política vigente: solo entran países de EUROPEAN_COUNTRIES, y de esos se excluyen
// explícitamente los de BLOCKED_COUNTRIES (aunque ya no estén en la lista europea,
// se deja el check aparte por claridad y por si la lista europea cambiara en el futuro).
// Ningún país fuera de EUROPEAN_COUNTRIES entra, sea cual sea.

export const geoBlock = (req, res, next) => {
  const ip = (req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '').replace('::ffff:', '');
  const geo = geoip.lookup(ip);
  const country = geo?.country;

  if (country && country !== 'ES') {
    console.log(`[fuera de España] country=${country} ip=${ip} path=${req.originalUrl}`);
  }

  // Sin resultado de geolocalización: se deja pasar (igual que antes). No hay dato con el
  // que decidir, y bloquear a ciegas sería peor que dejar pasar en este caso raro.
  if (!geo) return next();

  if (BLOCKED_COUNTRIES.includes(country)) {
    console.log(`[GEO_BLOCKED sancionado] country=${country} ip=${ip} path=${req.originalUrl}`);
    return res.status(403).json({ error: 'GEO_BLOCKED', message: 'This service is not available in your region' });
  }

  if (!EUROPEAN_COUNTRIES.includes(country)) {
    console.log(`[GEO_BLOCKED fuera de Europa] country=${country} ip=${ip} path=${req.originalUrl}`);
    return res.status(403).json({ error: 'GEO_BLOCKED', message: 'This service is not available in your region' });
  }

  next();
};