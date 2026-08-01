import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import healthRoute from './routes/health.route.js';
import authRoutes from './modules/auth/routes/auth.routes.js'
import tripRoutes from './modules/trips/routes/trip.routes.js'
import userRoutes from './modules/users/routes/user.routes.js'
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({origin: true, credentials: true}));
app.use(compression());
app.use(cookieParser());
app.use(express.json());

app.use('/health', healthRoute);
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/users', userRoutes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
