import rateLimit from 'express-rate-limit'

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 MIN
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        ok: false,
        message: "Too many requests, try again later"
    }
});