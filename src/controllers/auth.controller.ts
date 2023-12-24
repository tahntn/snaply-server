import { Request, Response } from 'express';
import { loginUserService, registerUserService } from '../services';
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
  const response = await loginUserService(email, password);
  res.status(httpStatus.OK).json(response);
});

export const registerUserController = catchAsync(async (req: Request, res: Response) => {
  const { email, password, userName } = req.body;
  const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  const isCheckEmail = reg.test(email);
  if (!email || !password || !userName) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please provide complete information.',
    });
  } else if (!isCheckEmail) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please enter a valid email.',
    });
  }
  const response = await registerUserService(req.body);
  res.status(200).json(response);
});
