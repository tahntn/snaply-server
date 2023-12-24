/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import ApiError from './ApiError';
import { httpStatus, KeysOfTypeHttpStatus } from '../constant';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorConverter = (err: any, _req: Request, _res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : (httpStatus.INTERNAL_SERVER_ERROR as 500);
    const message: string =
      error.message ||
      (Object.keys(httpStatus) as KeysOfTypeHttpStatus[]).find(
        (key) => httpStatus[key] === statusCode
      );
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message } = err;
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  res.locals['errorMessage'] = err.message;

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('error', err);
  }

  res.status(statusCode).send(response);
};
