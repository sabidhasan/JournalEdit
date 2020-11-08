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
import { INSUFFICIENT_PRIVILEGE, INVALID_JOB_SCHEMA, JOB_NOT_FOUND } from '../common/responseErrors';
import { Job } from '../entity/job.entity';

/**
 * Router Definition
 */
export const jobController = express.Router();

/**
 * Controller methods
 */
const handleGetJobs: RequestHandler = async (req, res) => {
  const user = await authService.findUserByEmail((req.user as IJWTPayload).email);
  const jobId = req.params.id;

  if (!user || user.role !== Role.JOB_CREATOR) {
    return res.status(401).json(INSUFFICIENT_PRIVILEGE);
  }

  if (jobId) {
    // Return data for single job
    const job = await jobService.findJobById(Number(jobId), user.id);
    return res.status(job ? 200 : 400).json(job || JOB_NOT_FOUND);
  }

  return res.status(200).json(await jobService.getJobsForJobCreator(user.id));
};

const handleCreateJob: RequestHandler = async (req, res) => {
  // Create job if user is JOB_CREATOR role
  const user = await authService.findUserByEmail((req.user as IJWTPayload).email);

  if (user?.role !== Role.JOB_CREATOR) {
    return res.status(401).json(INSUFFICIENT_PRIVILEGE);
  }

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
};

// const handleDeleteJob: RequestHandler = async (req, res) => {
//   // Delete job if user is JOB_CREATOR role, job exists, and is owned by user
//   const user = await authService.findUserByEmail((req.user as IJWTPayload).email);
//   const jobId = req.params.id;

//   if (!user || user.role !== Role.JOB_CREATOR) {
//     return res.status(401).json(INSUFFICIENT_PRIVILEGE);
//   } else if (!jobId) {
//     return res.status(400).json(JOB_NOT_FOUND);
//   }

//   // Return data for single job
//   const deletedJob = await jobService.deleteJob(Number(jobId), user.id);
//   if (deletedJob) {
//     return res.status(200).json(deletedJob);
//   }

//   return res.status(400).json(JOB_NOT_FOUND);
// };

/**
 * Controller routes
 */
jobController.get('/', passport.authenticate('jwt', { session: false }), handleGetJobs);
jobController.get('/:id', passport.authenticate('jwt', { session: false }), handleGetJobs);
jobController.post('/', passport.authenticate('jwt', { session: false }), handleCreateJob);
// jobController.delete('/', passport.authenticate('jwt', { session: false }), handleDeleteJob);