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
import { INSUFFICIENT_PRIVILEGE, INVALID_JOB_SCHEMA, JOB_NOT_FOUND, DELETE_FAILED } from '../common/responseErrors';
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

  if (!user || user.role !== Role.JOB_CREATOR) {
    return res.status(401).json(INSUFFICIENT_PRIVILEGE);
  }

  if (req.params.id) {
    // Return data for single job
    const job = await jobService.findJobById(Number(req.params.id), user.id);
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

const handleDeleteJob: RequestHandler = async (req, res) => {
  // Delete job if user is JOB_CREATOR role, job exists, and is owned by user
  if (!req.params.id) {
    return res.status(400).json(JOB_NOT_FOUND);
  }

  const user = await authService.findUserByEmail((req.user as IJWTPayload).email);
  if (!user || user.role !== Role.JOB_CREATOR) {
    return res.status(401).json(INSUFFICIENT_PRIVILEGE);
  }

  // Return data for single job
  const deletedJob = await jobService.deleteJob(Number(req.params.id), user.id);
  return res.status(deletedJob ? 200 : 500).json({ deleted: deletedJob === false ? DELETE_FAILED : deletedJob});
};

/**
 * Controller routes
 */

/**
 * @api {get} /api/v1/user/:id Request User information
 * @apiName GetUser
 * @apiGroup UserAPI
 *
 * @apiParam {Number} id Users unique ID.
 * @apiPermission Authorized users only
 *
 * @apiSuccess {Number} id Unique id of the User.
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 * @apiSuccess {Object} address  Address of the user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       'id': 1234,
 *       'firstname': 'John',
 *       'lastname': 'Doe',
 *       'address': {'zipCode' : '00100'}
 *     }
 *
 * @apiError UserNotFound 404 The id of the User was not found.
 * @apiError InvalidAuthentication 403 Authentication failed.
 *
 * @apiErrorExample UserNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       'error': 'UserNotFound'
 *     }
 * @apiErrorExample Forbidden:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       'error': 'Authorization failed'
 *     }
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:3000/api/v1/user/4711
 */
jobController.get('/', passport.authenticate('jwt', { session: false }), handleGetJobs);
jobController.get('/:id', passport.authenticate('jwt', { session: false }), handleGetJobs);
jobController.post('/', passport.authenticate('jwt', { session: false }), handleCreateJob);
jobController.delete('/:id', passport.authenticate('jwt', { session: false }), handleDeleteJob);