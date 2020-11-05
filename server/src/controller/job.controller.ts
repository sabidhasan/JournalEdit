/**
 * Required External Modules and Interfaces
 */
import express, { RequestHandler } from 'express';
import passport from 'passport';
import { validate } from 'class-validator';
import * as jobService from '../service/job.service';
import * as authService from '../service/auth.service';
import { Role } from '../entity/user.entity';
import { IJWTPayload } from './auth.controller';
import { INSUFFICIENT_PRIVILEGE, INVALID_JOB_SCHEMA } from '../common/responseErrors';
import { Job } from '../entity/job.entity';

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
    return res.status(200).json(await jobService.getJobsForUser(user.id));
  }

  return res.status(401).json(INSUFFICIENT_PRIVILEGE);
};

const handleCreateJob: RequestHandler = async (req, res) => {
  // Create job if user is JOB_CREATOR role
  const user = await authService.findUserByEmail((req.user as IJWTPayload).email);

  if (user?.role === Role.JOB_CREATOR) {
    const newJob = new Job();
    newJob.name = req.body.name;
    newJob.description = req.body.description;
    newJob.journal = req.body.journal;
    newJob.language = req.body.language;
    newJob.pay = req.body.pay;
    newJob.owner = user;

    try {
      if ((await validate(newJob)).length) {
        throw new Error(INVALID_JOB_SCHEMA);
      }

      return res.status(200).json(await jobService.createJob(newJob));
    } catch (error) {
      return res.status(400).json(error.message);
    }
  } else {
    return res.status(401).json(INSUFFICIENT_PRIVILEGE);
  }
};

/**
 * Controller routes
 */
jobController.get('/', passport.authenticate('jwt', { session: false }), handleGetJobs);
jobController.post('/', passport.authenticate('jwt', { session: false }), handleCreateJob);