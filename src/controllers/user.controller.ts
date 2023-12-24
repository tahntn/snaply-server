import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { httpStatus } from '../constant';
import pick from '../utils/pick';
import { getUserByIdService, searchUserNameService, updateUserService } from '../services';
import { IQueryUser } from '../types';

export const searchUserNameController = catchAsync(async (req: Request, res: Response) => {
  //check q
  if (!req.query.q) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please provide keyword',
    });
  }

  const query: IQueryUser = pick(req.query, ['limit, page', 'q']);

  const response = await searchUserNameService(query);

  res.status(httpStatus.OK).json(response);
});

export const updateUserController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const data = req.body;
  if (!userId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please provide a valid user id',
    });
  }
  const response = await updateUserService(userId, data);
  return res.status(httpStatus.OK).json(response);
});

export const getUserByIdController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please provide a valid user id',
    });
  }
  const response = await getUserByIdService(userId);
  return res.status(httpStatus.OK).json(response);
});
