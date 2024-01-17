import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { httpStatus } from '../constant';
import { IQueryUser } from '../types';
import { catchAsync, pick } from '../utils';
import {
  changePasswordService,
  getDetailUserByIdService,
  getUserByIdService,
  searchUserNameService,
  updateUserService,
} from '../services';
import { validate } from '../middlewares';
import { changePassword, searchUserName, updateUser } from '../validators';

export const searchUserNameController = catchAsync(async (req: Request, res: Response) => {
  await validate(searchUserName(req))(req, res);
  const user = req.user;
  const query: IQueryUser = pick(req.query, ['limit', 'page', 'q']);
  const response = await searchUserNameService({ ...query, userId: user?._id });
  res.status(httpStatus.OK).json(response);
});

export const updateUserController = catchAsync(async (req: Request, res: Response) => {
  await validate(updateUser(req))(req, res);
  const currentUser = req.user;
  const data = req.body;
  const response = await updateUserService(
    new mongoose.Types.ObjectId(currentUser!._id),
    data,
    req.t
  );
  return res.status(httpStatus.OK).json(response);
});

export const changePasswordController = catchAsync(async (req: Request, res: Response) => {
  await validate(changePassword(req))(req, res);
  const currentUser = req.user;
  const { oldPassword, newPassword } = req.body;
  await changePasswordService(
    new mongoose.Types.ObjectId(currentUser!._id),
    { oldPassword, newPassword },
    req.t
  );
  return res.status(httpStatus.NO_CONTENT).send();
});

export const getDetailUserByIdController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const response = await getDetailUserByIdService({
    id: new mongoose.Types.ObjectId(userId),
    currentUser: req.user!,
    t: req.t,
  });
  return res.status(httpStatus.OK).json(response);
});

export const getMeController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const response = await getUserByIdService(new mongoose.Types.ObjectId(userId), req.t);
  return res.status(httpStatus.OK).json(response);
});
