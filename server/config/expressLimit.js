import rateLimit from 'express-rate-limit'

const defaultOptions = {
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => {
        return req.user?._id?.toString() ?? req.ip;
    }
};

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


//app limiters:

export const readLimiter = rateLimit({
    ...defaultOptions,

    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 300,

    message: {
        ok: false,
        message: "Too many requests."
    }
});

export const writeLimiter = rateLimit({
    ...defaultOptions,

    windowMs: 5 * 60 * 1000,
    max: 30,

    message: {
        ok: false,
        message: "Too many write operations."
    }
});


export const adminLimiter = rateLimit({
    ...defaultOptions,

    windowMs: 5 * 60 * 1000,
    max: 60,

    message: {
        ok: false,
        message: "Too many admin operations."
    }
});

export const changePasswordLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Too many password change attempts.",
  },
  standardHeaders: true,
  legacyHeaders: false,
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


export const matchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    return req.user?._id?.toString() ?? req.ip;
  },
  message: {
    ok: false,
    message: "Too many match operations."
  }
});

export const addFundsLimiter = rateLimit({
    ...defaultOptions,

    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 5,

    message: {
        ok: false,
        message: "Too many requests."
    }
});




export const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => {
    return req.user?._id?.toString() ?? req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//for picture uploads
export const uploadLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    keyGenerator: (req) => req.user?._id?.toString() ?? req.ip,
    message: {
        ok: false,
        message: "Too many uploads."
    }
});