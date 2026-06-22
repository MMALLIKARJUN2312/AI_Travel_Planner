import { Router } from "express";
import mongoose from 'mongoose';

const router = Router();

const states = {
    0 : "disconnected",
    1 : "connected",
    2 : "connecting",
    3 : "disconnecting"
}

router.get('/', (_, res) => {
    res.status(200).json({
        success : true,
        database : states[mongoose.connection.readyState as 0 | 1 | 2 | 3],
        uptime : Math.floor(process.uptime())
    })
})

export default router;