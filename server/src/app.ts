/**
 * Required External Modules
 */
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { authController } from './controller/auth.controller';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import './common/passport';

dotenv.config();

/**
 * App Variables
 */
if (!process.env.PORT) {
  console.error('No port specified, exiting app');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('No JWT secret specified, exiting app');
  process.exit(1);
}

const app = express();

/**
 *  App Configuration
 */
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authController);

// Error handlers
app.use(errorHandler);
app.use(notFoundHandler);

export default app;
