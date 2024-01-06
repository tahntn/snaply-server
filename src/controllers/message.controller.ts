/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { httpStatus } from '../constant';
import { catchAsync, pick } from '../utils';

import { getListMessageByConversationIdService, sendMessageService } from '../services';
import mongoose from 'mongoose';
import { validate } from '../middlewares';
import { getListMessageByConversationIdValidate, sendMessageValidate } from '../validators';

export const sendMessagesController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(sendMessageValidate(req))(req, res, next);
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

export const getListMessageByConversationIdController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(getListMessageByConversationIdValidate(req))(req, res, next);
    const user = req.user!;
    const query = pick(req.query, ['limit', 'page']);

    const response = await getListMessageByConversationIdService({
      user,
      conversationId: req.params.conversationId as string,
      page: query?.page,
      limit: query?.limit,
      req,
    });
    res.status(httpStatus.OK).json(response);
  }
);
