import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { httpStatus } from '../constant';
import { IQueryUser } from '../types';
import { areIdsEqual, catchAsync, pick } from '../utils';
import {
  getDetailUserByIdService,
  getUserByIdService,
  searchUserNameService,
  updateUserService,
} from '../services';
import { validate } from '../middlewares';
import { searchUserName, updateUser } from '../validators';

export const searchUserNameController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(searchUserName(req))(req, res, next);
    const user = req.user;
    const query: IQueryUser = pick(req.query, ['limit', 'page', 'q']);
    const response = await searchUserNameService({ ...query, userId: user?._id });
    res.status(httpStatus.OK).json(response);
  }
);

export const updateUserController = catchAsync(async (req: Request, res: Response) => {
  await validate(updateUser(req))(req, res);
  const currentUser = req.user;
  const data = req.body;
  const response = await updateUserService(
    new mongoose.Types.ObjectId(currentUser!._id),
    data,
    req
  );
  return res.status(httpStatus.OK).json(response);
});

export const getDetailUserByIdController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const response = await getDetailUserByIdService(new mongoose.Types.ObjectId(userId), req);
  return res.status(httpStatus.OK).json(response);
});

export const getMeController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const response = await getUserByIdService(new mongoose.Types.ObjectId(userId), req);
  return res.status(httpStatus.OK).json(response);
});
