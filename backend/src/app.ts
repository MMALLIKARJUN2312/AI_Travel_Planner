import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import healthRoute from './routes/health.route.js';

const app = express();

app.use(helmet());
app.use(cors({origin: true, credentials: true}));
app.use(compression());
app.use(cookieParser());
app.use(express.json());

app.use('/health', healthRoute);

export default app;
