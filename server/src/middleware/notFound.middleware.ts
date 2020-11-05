import { Request, Response, NextFunction } from 'express';
import { NOT_FOUND } from '../common/responseErrors';

export const notFoundHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.status(404).json(NOT_FOUND);
};
