/**
 * Required External Modules and Interfaces
 */
import express, { RequestHandler } from 'express';
import passport from 'passport';
import { validate } from 'class-validator';
import * as jobService from '../service/job.service';
import * as jobApplicationService from '../service/jobapplication.service';
import * as authService from '../service/auth.service';
import { Role } from '../entity/user.entity';
import { IJWTPayload } from './auth.controller';
import {
  INSUFFICIENT_PRIVILEGE,
  JOB_NOT_FOUND,
  DELETE_FAILED,
  INVALID_APPLICATION_SCHEMA,
  JOB_APPLICATION_ALREADY_EXISTS,
} from '../common/responseErrors';
import { JobApplication } from '../entity/jobapplication.entity';

/**
 * Router Definition
 */
export const jobApplicationController = express.Router();

/**
 * Controller methods
 */
const handleGetJobApplications: RequestHandler = async (req, res) => {
  const user = await authService.findUserByEmail((req.user as IJWTPayload).email);

  if (!user) {
    return res.status(401).json(INSUFFICIENT_PRIVILEGE);
  }

  if (user.role === Role.JOB_SEEKER) {
    return res.status(200).json(await jobApplicationService.getApplicationsForSeeker(user.id));
  }

  return res.status(200).json(await jobApplicationService.getApplicationsForCreator(user.id));
};

const handleCreateApplication: RequestHandler = async (req, res) => {
  const user = await authService.findUserByEmail((req.user as IJWTPayload).email);

  if (!user || user.role !== Role.JOB_SEEKER) {
    return res.status(401).json(INSUFFICIENT_PRIVILEGE);
  }

  if (!req.body.jobId) {
    return res.status(401).json(JOB_NOT_FOUND);
  }

  const job = await jobService.findJobById(req.body.jobId);

  if (!job) {
    return res.status(404).json(JOB_NOT_FOUND);
  }

  if (job.applications.find((app) => app.applicant.id === user.id)) {
    return res.status(403).json(JOB_APPLICATION_ALREADY_EXISTS);
  }

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

    return res.status(200).json(await jobApplicationService.createJobApplication(application));
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const handleDeleteApplication: RequestHandler = async (req, res) => {
  const user = await authService.findUserByEmail((req.user as IJWTPayload).email);

  if (!user || user.role !== Role.JOB_SEEKER) {
    return res.status(401).json(INSUFFICIENT_PRIVILEGE);
  }

  const targetApplication = (await jobApplicationService.getApplicationsForSeeker(user.id))
    .find(application => application.id === Number(req.params.id));

  if (!targetApplication) {
    return res.status(404).json(JOB_NOT_FOUND);
  }

  const deleteJobStatus = await jobApplicationService.deleteJobApplication(targetApplication);
  return res.status(deleteJobStatus ? 200 : 500).json({ deleted: deleteJobStatus == false ? DELETE_FAILED : true });
};

/**
 * Controller routes
 */
jobApplicationController.get('/', passport.authenticate('jwt', { session: false }), handleGetJobApplications);
jobApplicationController.post('/', passport.authenticate('jwt', { session: false }), handleCreateApplication);
jobApplicationController.delete('/:id', passport.authenticate('jwt', { session: false }), handleDeleteApplication);
