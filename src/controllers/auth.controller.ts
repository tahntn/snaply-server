import { Request, Response } from 'express';
import { httpStatus } from '../constant';
import {
  validateLogin,
  validateLogout,
  validateRefreshTokens,
  validateRegister,
} from '../validators';
import { catchAsync } from '../utils';
import {
  loginUserService,
  logoutService,
  refreshTokensService,
  registerUserService,
} from '../services';
import { generateAuthTokens } from '../services/token.service';
import { AccessAndRefreshTokens } from '../types/token.interface';
import { validate } from '../middlewares';

export const loginUserController = catchAsync(async (req: Request, res: Response) => {
  await validate(validateLogin(req))(req, res);

  const { email, password } = req.body;
  const response = await loginUserService(email, password, req);
  let tokens: AccessAndRefreshTokens | null = null;
  if (response) {
    tokens = await generateAuthTokens(response?.user);
  }
  res.status(httpStatus.OK).json({
    data: tokens,
  });
});

export const registerUserController = catchAsync(async (req: Request, res: Response) => {
  await validate(validateRegister(req))(req, res);

  const { email, password, username } = req.body;
  const response = await registerUserService({ email, password, username }, req);
  let tokens: AccessAndRefreshTokens | null = null;
  if (response) {
    tokens = await generateAuthTokens(response.user);
  }
  res.status(httpStatus.CREATED).json({
    data: tokens,
  });
});

export const logoutController = catchAsync(async (req: Request, res: Response) => {
  await validate(validateLogout(req))(req, res);

  await logoutService(req.body.refreshToken, req);
  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokensController = catchAsync(async (req: Request, res: Response) => {
  await validate(validateRefreshTokens(req))(req, res);
  const userWithTokens = await refreshTokensService(req.body.refreshToken, req);
  res.send({ ...userWithTokens });
});
