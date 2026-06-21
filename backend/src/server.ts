import app from './app.js';
import { env } from './config/env.js';
import { logger } from './core/logger/logger.js';
import { connectDatabase } from './config/database.js';

const startServer = async () => {
    try {
        await connectDatabase();
    
        app.listen(env.PORT, () => {
            logger.info(`Server running on the port ${env.PORT}`)
        })
    } catch (error) {
        logger.error("Failed to start the server", error);
        process.exit(1);
    }
}

startServer();