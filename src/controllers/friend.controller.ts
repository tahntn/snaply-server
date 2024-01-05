import mongoose from 'mongoose';
import { httpStatus } from '../constant';
import {
  confirmFriendRequestService,
  createFriendRequestService,
  denyFriendRequestService,
} from '../services';
import { catchAsync } from '../utils';
import { NextFunction, Request, Response } from 'express';
import { validate } from '../middlewares';
import {
  createFriendRequestValidate,
  updateFriendRequestValidate,
} from '../validators/friend.validator';

export const createFriendRequestController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(createFriendRequestValidate(req))(req, res, next);
    const userId = req.params.userId;
    const response = await createFriendRequestService({
      req,
      receiverUserId: new mongoose.Types.ObjectId(userId),
    });

    res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED,
      message: req.t('friend.createFriend.success'),
      data: response,
    });
  }
);

export const confirmFriendRequestController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(updateFriendRequestValidate(req))(req, res, next);
    const friendRequestId = req.params.friendRequestId;
    const response = await confirmFriendRequestService({
      req,
      friendRequestId: new mongoose.Types.ObjectId(friendRequestId),
    });

    res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: req.t('friend.confirmFriend.success'),
      data: response,
    });
  }
);

export const denyFriendRequestController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(updateFriendRequestValidate(req))(req, res, next);
    const friendRequestId = req.params.friendRequestId;
    const response = await denyFriendRequestService({
      req,
      friendRequestId: new mongoose.Types.ObjectId(friendRequestId),
    });

    res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: req.t('friend.denyFriend.success'),
      data: response,
    });
  }
);
