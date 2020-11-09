/**
 * Required External Modules
 */
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
// Middleware
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import './common/passport';
// Controllers
import { authController } from './controller/auth.controller';
import { jobController } from './controller/job.controller';
import { jobApplicationController } from './controller/jobapplication.controller';
import { commentController } from './controller/comment.controller';

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
app.use('/jobs', jobController);
app.use('/applications', jobApplicationController);
app.use('/comments', commentController);

// Error handlers
app.use(errorHandler);
app.use(notFoundHandler);

export default app;
