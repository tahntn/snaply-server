/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { httpStatus } from '../constant';
import { catchAsync, pick } from '../utils';

import {
  getListMessageByConversationIdService,
  pinMessageService,
  sendMessageService,
} from '../services';
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
        conversationId: new mongoose.Types.ObjectId(conversationId),
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
    const conversationId = req.params.conversationId;

    const response = await getListMessageByConversationIdService({
      user,
      conversationId: new mongoose.Types.ObjectId(conversationId),
      page: query?.page,
      limit: query?.limit,
      req,
    });
    res.status(httpStatus.OK).json(response);
  }
);

export const pinMessageController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user!;
    const conversationId = req.params.conversationId;
    const messageId = req.params.messageId;

    const response = await pinMessageService({
      currentUser,
      conversationId: new mongoose.Types.ObjectId(conversationId),
      messageId: new mongoose.Types.ObjectId(messageId),
      t: req.t,
    });
    res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: req.t('message.success.updatedSuccessful'),
      data: response?.message,
    });
  }
);
