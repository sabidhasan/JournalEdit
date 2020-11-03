/**
 * Required External Modules
 */
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { usersRouter } from './controller/users.controller';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';

dotenv.config();

/**
 * App Variables
 */
if (!process.env.PORT) {
  console.error('No port specified, exiting app');
  process.exit(1);
}

const app = express();

/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", usersRouter);

// Error handlers
app.use(errorHandler);
app.use(notFoundHandler);

export default app;
