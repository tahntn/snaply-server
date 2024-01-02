/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { httpStatus } from '../constant';
import { catchAsync } from '../utils';

import { sendMessageService } from '../services';

export const sendMessagesController = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user;

  //check payload
  const { title, conversationsId } = req.body;
  if (!currentUser) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'User is not existing',
    });
  }
  const response = await sendMessageService(
    {
      user: currentUser,
      conversationsId,
      title,
    },
    req
  );
  res.status(httpStatus.OK).json(response);
});
export const getAllMessagesController = catchAsync(async (req: Request, res: Response) => {});
export const getMessageByIdController = catchAsync(async (req: Request, res: Response) => {});
export const updateMessageController = catchAsync(async (req: Request, res: Response) => {});
export const deleteMessageController = catchAsync(async (req: Request, res: Response) => {});
