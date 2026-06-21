import app from './app.js';
import { env } from './config/env.js';
import { logger } from './core/logger/logger.js';

app.listen(env.PORT, () => {
    logger.info(`Server running on the port ${env.PORT}`)
})