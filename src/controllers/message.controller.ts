/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { httpStatus } from '../constant';
import { catchAsync } from '../utils';

import { sendMessageService } from '../services';
import mongoose from 'mongoose';
import { validate } from '../middlewares';
import { sendMessage } from '../validators';

export const sendMessagesController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(sendMessage(req))(req, res, next);
    const currentUser = req.user!;
    const conversationId = req.params.conversationId;
    const { title } = req.body;

    const response = await sendMessageService(
      {
        user: currentUser,
        conversationsId: new mongoose.Types.ObjectId(conversationId),
        title,
      },
      req
    );
    res.status(httpStatus.OK).json(response);
  }
);
