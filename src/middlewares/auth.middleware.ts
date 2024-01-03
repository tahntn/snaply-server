/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import ApiError from '../errors/ApiError';
import { httpStatus, roleRights } from '../constant';
import { IUser } from '../models';

const verifyCallback =
  (req: Request, resolve: any, reject: any, requiredRights: string[]) =>
  async (err: Error, user: IUser, info: string) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.ACCESS_TOKEN_EXPIRED, req.t('auth.error.unauthorized'))
      );
    }
    req.user = user;
    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      if (!userRights)
        return reject(new ApiError(httpStatus.FORBIDDEN, req.t('auth.error.forbidden')));
      const hasRequiredRights = requiredRights.every((requiredRight: string) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredRights && req.params['userId'] !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, req.t('auth.error.forbidden')));
      }
    }

    resolve();
  };

const authMiddleware =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) =>
    new Promise<void>((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));

export default authMiddleware;
