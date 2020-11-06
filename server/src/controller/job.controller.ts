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
import {
  INSUFFICIENT_PRIVILEGE,
  INVALID_JOB_SCHEMA,
  JOB_NOT_FOUND,
  INVALID_APPLICATION_SCHEMA,
} from '../common/responseErrors';
import { Job } from '../entity/job.entity';
import { JobApplication } from '../entity/jobapplication.entity';

/**
 * Router Definition
 */
export const jobController = express.Router();

/**
 * Controller methods
 */
const handleGetJobsForCreator: RequestHandler = async (req, res) => {
  const user = await authService.findUserByEmail((req.user as IJWTPayload).email);

  if (!user || user.role !== Role.JOB_CREATOR) {
    return res.status(401).json(INSUFFICIENT_PRIVILEGE);
  }

  return res.status(200).json(await jobService.getJobsForJobCreator(user.id));
};

const handleGetJobsForSeeker: RequestHandler = async (req, res) => {
  const user = await authService.findUserByEmail((req.user as IJWTPayload).email);

  if (!user || user.role !== Role.JOB_SEEKER) {
    return res.status(401).json(INSUFFICIENT_PRIVILEGE);
  }

  return res.status(200).json(await jobService.getJobsForJobSeeker(user.id));
};

const handleCreateNewJob: RequestHandler = async (req, res) => {
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
  }
  
  return res.status(401).json(INSUFFICIENT_PRIVILEGE);
};

const handleApplyToJob: RequestHandler = async (req, res) => {
  const user = await authService.findUserByEmail((req.user as IJWTPayload).email);
  const job = await jobService.findJobById(req.body.jobId);

  if (!job) {
    return res.status(404).json(JOB_NOT_FOUND);
  }
  
  if (user?.role === Role.JOB_SEEKER) {
    // Create job application
    const application = new JobApplication();
    application.approved = false;
    application.applicant = user;
    application.text = req.body.applicationText;
    application.job = job;

    try {
      if ((await validate(application)).length) {
        throw new Error(INVALID_APPLICATION_SCHEMA);
      }

      return res.status(200).json(await jobService.applyToJob(job, application));
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  return res.status(401).json(INSUFFICIENT_PRIVILEGE);
};

/**
 * Controller routes
 */
jobController.get('/', passport.authenticate('jwt', { session: false }), handleGetJobsForCreator);
jobController.post('/', passport.authenticate('jwt', { session: false }), handleCreateNewJob);
jobController.get('/application', passport.authenticate('jwt', { session: false }), handleGetJobsForSeeker);
jobController.post('/application', passport.authenticate('jwt', { session: false }), handleApplyToJob);