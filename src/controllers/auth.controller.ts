import { Request, Response } from 'express';

import { httpStatus } from '../constant';
import { validateEmail } from '../validators';
import { catchAsync } from '../utils';
import { loginUserService, registerUserService } from '../services';

export const loginUserController = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  //check invalid email
  const emailError = validateEmail(email);

  //check existing email and password
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

  //check invalid email
  const emailError = validateEmail(email);

  //check existing email, password and userName
  if (!email || !password || !userName) {
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
  const response = await registerUserService({ email, password, userName });
  res.status(httpStatus.CREATED).json(response);
});
