import dotenv from 'dotenv';
import {z} from 'zod';

dotenv.config();

const envSchema = z.object({
    NODE_ENV : z.enum([
        "development",
        "test",
        "production"
    ]),
    PORT : z.coerce.number().default(5000),
    MONGODB_URI : z.string(),
    
    JWT_ACCESS_SECRET : z.string().min(32),
    JWT_REFRESH_SECRET : z.string().min(32),

    ACCESS_TOKEN_EXPIRES_IN : z.string(),
    REFRESH_TOKEN_EXPIRES_IN : z.string(),
})

export const env = envSchema.parse(process.env);