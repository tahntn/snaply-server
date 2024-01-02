import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { httpStatus } from '../constant';
import { catchAsync } from '../utils';
import {
  confirmFriendRequestService,
  confirmFriendRequestService2,
  createFriendRequestService,
} from '../services';

export const createFriendRequestController = catchAsync(async (req: Request, res: Response) => {
  const { receiverEmail } = req.body;
  const user = req.user;
  if (!user) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'User is not existing',
    });
  }
  if (!receiverEmail) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please provide email of friend',
    });
  }
  const response = await createFriendRequestService({
    sender: user,
    receiverEmail,
  });
  return res.status(httpStatus.OK).json(response);
});

export const confirmFriendRequestController = catchAsync(async (req: Request, res: Response) => {
  const confirmUserId = req.params.id;
  if (!confirmUserId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please provide id',
    });
  }
  const user = req.user;
  if (!user) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'User is not existing',
    });
  }
  const response = await confirmFriendRequestService({
    currentUser: user,
    confirmUserId: new mongoose.Types.ObjectId(confirmUserId),
  });
  return res.status(httpStatus.OK).json(response);
});

export const confirmFriendRequestController2 = catchAsync(async (req: Request, res: Response) => {
  const friendRequestId = req.params.id;
  const user = req.user;
  if (!user) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'User is not existing',
    });
  }
  if (!friendRequestId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please provide id',
    });
  }
  const response = await confirmFriendRequestService2({
    currentUser: user,
    friendRequestId: new mongoose.Types.ObjectId(friendRequestId),
  });
  return res.status(httpStatus.OK).json(response);
});
