/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { loginUserService } from '../services';
import { httpStatus } from '../constant';
import catchAsync from '../utils/catchAsync';
import { validateEmail } from '../validators/emailValidator';

export const loginUserController = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const emailError = validateEmail(email);
  if (!email || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please provide complete information.',
    });
  } else if (emailError) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please enter a valid email.',
    });
  }
  const ressponse = await loginUserService(email, password);
  res.status(httpStatus.OK).json(ressponse);
});
