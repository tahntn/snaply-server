import mongoose from 'mongoose';
import { httpStatus } from '../constant';
import {
  confirmFriendRequestService,
  createFriendRequestService,
  denyFriendRequestService,
  getListFriendByUserIdService,
  getListFriendSortByAlphabetService,
} from '../services';
import { catchAsync } from '../utils';
import { NextFunction, Request, Response } from 'express';
import { validate } from '../middlewares';
import {
  createFriendRequestValidate,
  getListFriendByUserIdValidate,
  getListFriendSortByAlphabetValidate,
  updateFriendRequestValidate,
} from '../validators/friend.validator';

export const createFriendRequestController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(createFriendRequestValidate(req))(req, res, next);
    const userId = req.params.userId;
    const response = await createFriendRequestService({
      t: req.t,
      receiverUserId: new mongoose.Types.ObjectId(userId),
      currentUser: req.user!,
    });

    res.status(httpStatus.CREATED).json(response);
  }
);

export const confirmFriendRequestController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(updateFriendRequestValidate(req))(req, res, next);
    const friendRequestId = req.params.friendRequestId;
    const response = await confirmFriendRequestService({
      t: req.t,
      friendRequestId: new mongoose.Types.ObjectId(friendRequestId),
      currentUser: req.user!,
    });

    res.status(httpStatus.OK).json(response);
  }
);

export const denyFriendRequestController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(updateFriendRequestValidate(req))(req, res, next);
    const friendRequestId = req.params.friendRequestId;
    await denyFriendRequestService({
      t: req.t,
      friendRequestId: new mongoose.Types.ObjectId(friendRequestId),
      currentUser: req.user!,
    });

    res.status(httpStatus.NO_CONTENT).send();
  }
);

export const getListFriendByUserIdController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(getListFriendByUserIdValidate(req))(req, res, next);

    const response = await getListFriendByUserIdService(req);
    res.status(httpStatus.OK).json(response);
  }
);

export const getListFriendSortByAlphabetController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(getListFriendSortByAlphabetValidate(req))(req, res, next);

    const response = await getListFriendSortByAlphabetService(req);
    res.status(httpStatus.OK).json(response);
  }
);
