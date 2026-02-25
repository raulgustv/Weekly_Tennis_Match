import rateLimit from 'express-rate-limit'

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 MIN
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        ok: false,
        message: "Too many requests, try again later"
    }
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 MIN
    max: 5,
    skipSuccessfulRequests: true,
    keyGenerator: (req) => {
        return `${req.body.email}_${req.ip}`;
    },
    message: {
        ok: false,
        message: "Too many authentication, try again later"
    }
});

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, //1hr
    max: 5,
    message: {
        ok: false,
        message: "Too many registrations"
    }
});

export const resetPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, //1hr
    max: 3,
    message: {
        ok: false,
        message: "Too many password reset attempts, try again later"
    }
});

export const matchLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, //5 MIN
    max: 20,
    message: {
        ok: false,
        message: "Too many match operations"
    }
});