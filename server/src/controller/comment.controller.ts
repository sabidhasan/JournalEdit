/**
 * Required External Modules and Interfaces
 */
import express, { RequestHandler } from 'express';
import passport from 'passport';
import { validate } from 'class-validator';
import * as commentService from '../service/comment.service';
import * as authService from '../service/auth.service';
import * as jobService from '../service/job.service';
// import { Role } from '../entity/user.entity';
import { IJWTPayload } from './auth.controller';
import { JOB_NOT_FOUND, INSUFFICIENT_PRIVILEGE, INVALID_COMMENT_SCHEMA } from '../common/responseErrors';
  // , INVALID_JOB_SCHEMA, JOB_NOT_FOUND, DELETE_FAILED } from '
// import { Job } from '../entity/job.entity';
import { Comment } from '../entity/comment.entity';

/**
 * Router Definition
 */
export const commentController = express.Router();

/**
 * Controller methods
 */
const handleGetComments: RequestHandler = async (req, res) => {
  // Get comments for a specific job
  if (!req.body.jobId) {
    return res.status(400).json(JOB_NOT_FOUND);
  }

  const user = await authService.findUserByEmail((req.user as IJWTPayload).email);
  if (!user) {
    return res.status(401).json(INSUFFICIENT_PRIVILEGE);
  }

  try {
    return res.status(200).json(await commentService.findCommentsForJob(req.body.jobId));
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const handleCreateComment: RequestHandler = async (req, res) => {
  const user = await authService.findUserByEmail((req.user as IJWTPayload).email);
  if (!user) {
    return res.status(401).json(INSUFFICIENT_PRIVILEGE);
  }
  
  const targetJob = await jobService.findJobById(req.body.jobId);
  if (!targetJob) {
    return res.status(400).json(JOB_NOT_FOUND);
  }

  const newComment = new Comment();
  newComment.text = req.body.text;
  newComment.user = user;
  newComment.job = targetJob;

  try {
    if ((await validate(newComment)).length) {
      throw new Error(INVALID_COMMENT_SCHEMA);
    }
    return res.status(200).json(await commentService.createComment(newComment));
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

/**
 * Controller routes
 */
commentController.get('/', passport.authenticate('jwt', { session: false }), handleGetComments);
commentController.post('/', passport.authenticate('jwt', { session: false }), handleCreateComment);