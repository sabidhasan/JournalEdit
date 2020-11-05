/**
 * Required External Modules and Interfaces
 */
import express, { RequestHandler } from 'express';
import passport from 'passport';
import * as jobService from '../service/job.service';
import * as authService from '../service/auth.service';
import { Role } from '../entity/user.entity';
import { IJWTPayload } from './auth.controller';
import { INSUFFICIENT_PRIVILEGE } from '../common/responseErrors';
/**
 * Router Definition
 */
export const jobController = express.Router();

/**
 * Controller methods
 */
const handleGetJobs: RequestHandler = async (req, res) => {
  // Determine if user has proper role, and return their jobs
  const user = await authService.findUserByEmail((req.user as IJWTPayload).email);

  if (user?.role === Role.JOB_CREATOR) {
    return res.status(200).send(await jobService.getJobsForUser(user.id));
  }

  return res.status(401).send({ error: INSUFFICIENT_PRIVILEGE })
};

/**
 * Controller routes
 */
jobController.get('/', passport.authenticate('jwt', { session: false }), handleGetJobs);
