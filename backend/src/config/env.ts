import dotenv from 'dotenv';
import {z} from 'zod';

dotenv.config();

const envSchema = z.object({
    NODE_ENV : z.enum([
        "development",
        "test",
        "production"
    ]),
    PORT : z.coerce.number(),
    MONGODB_URI : z.string()
})

export const env = envSchema.parse(process.env);