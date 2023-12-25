import { Request, Response } from 'express';

import { httpStatus } from '../constant';
import { validateEmail } from '../validators';
import { catchAsync } from '../utils';
import {
  loginUserService,
  logoutService,
  refreshTokensService,
  registerUserService,
} from '../services';
import { generateAuthTokens } from '../services/token.service';
import { AccessAndRefreshTokens } from '../types/token.interface';

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
  let tokens: AccessAndRefreshTokens | null = null;
  if (response) {
    tokens = await generateAuthTokens(response?.data.checkUser);
  }
  res.status(httpStatus.OK).json({
    response,
    tokens,
  });
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
  let tokens: AccessAndRefreshTokens | null = null;
  if (response) {
    tokens = await generateAuthTokens(response?.data.user);
  }
  res.status(httpStatus.CREATED).json({ response, tokens });
});

export const logoutController = catchAsync(async (req: Request, res: Response) => {
  await logoutService(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokensController = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await refreshTokensService(req.body.refreshToken);
  res.send({ ...userWithTokens });
});
