import mongoose from 'mongoose';
import { Response } from 'express';
import { httpStatus } from '../constant';
import { IRequest } from '../types';
import { catchAsync } from '../utils';
import {
  confirmFriendRequestService,
  confirmFriendRequestService2,
  createFriendRequestService,
} from '../services';

export const createFriendRequestController = catchAsync(async (req: IRequest, res: Response) => {
  const { receiverEmail } = req.body;
  if (!receiverEmail) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please provide email of friend',
    });
  }
  const response = await createFriendRequestService({
    sender: req.user,
    receiverEmail,
  });
  return res.status(httpStatus.OK).json(response);
});

export const confirmFriendRequestController = catchAsync(async (req: IRequest, res: Response) => {
  const confirmUserId = req.params.id;
  if (!confirmUserId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please provide id',
    });
  }
  const response = await confirmFriendRequestService({
    currentUser: req.user,
    confirmUserId: new mongoose.Types.ObjectId(confirmUserId),
  });
  return res.status(httpStatus.OK).json(response);
});

export const confirmFriendRequestController2 = catchAsync(async (req: IRequest, res: Response) => {
  const friendRequestId = req.params.id;
  if (!friendRequestId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please provide id',
    });
  }
  const response = await confirmFriendRequestService2({
    currentUser: req.user,
    friendRequestId: new mongoose.Types.ObjectId(friendRequestId),
  });
  return res.status(httpStatus.OK).json(response);
});
