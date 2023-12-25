import { Response } from 'express';
import { httpStatus } from '../constant';
import { IRequest } from '../types';
import { catchAsync } from '../utils';
import { createFriendRequestService } from '../services/friendRequest.service';

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
