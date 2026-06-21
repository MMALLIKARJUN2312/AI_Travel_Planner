import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../core/logger/logger.js";

export const connectDatabase = async () : Promise<void> => {
    try {
        await mongoose.connect(env.MONGODB_URI)
        logger.info("Connected to the MongoDB Database");
    } catch (error) {
        logger.error("MongoDB connection failed", error);
        process.exit(1);
    }
}