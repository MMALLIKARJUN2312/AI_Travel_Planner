import rateLimit from 'express-rate-limit';
import { env } from '../../../config/env.js';

export const authRateLimit = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : env.NODE_ENV === "test" ? 1000 : 10,
    standardHeaders : true,
    legacyHeaders : false,
    message : {
        success : false,
        message : "Too many requests. Please try again later"
    }
})