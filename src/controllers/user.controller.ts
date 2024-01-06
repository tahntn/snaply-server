import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { httpStatus } from '../constant';
import { IQueryUser } from '../types';
import { areUserIdsEqual, catchAsync, pick } from '../utils';
import { getUserByIdService, searchUserNameService, updateUserService } from '../services';
import { validate } from '../middlewares';
import { searchUserName } from '../validators';

export const searchUserNameController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(searchUserName(req))(req, res, next);
    const user = req.user;
    const query: IQueryUser = pick(req.query, ['limit', 'page', 'q']);
    const response = await searchUserNameService({ ...query, userId: user?._id });
    res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: req.t('user.searchUser.success'),
      data: response,
    });
  }
);

export const updateUserController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = req.user;
  const data = req.body;

  if (
    !areUserIdsEqual({
      userId1: user?._id,
      userId2: new mongoose.Types.ObjectId(userId),
    })
  ) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      code: httpStatus.UNAUTHORIZED,
      message: req.t('user.updateUser.unauthorized'),
    });
  }
  const response = await updateUserService(userId, data, req);
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Updated successful.',
    data: response?.data,
  });
});

export const getUserByIdController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const response = await getUserByIdService(new mongoose.Types.ObjectId(userId), req);
  return res.status(httpStatus.OK).json(response);
});
