/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpStatus } from '../constant';
import ApiError from './ApiError';

export const handleError = (error: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('error', error);
  }
  if (error instanceof ApiError) {
    throw error;
  } else {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
};
