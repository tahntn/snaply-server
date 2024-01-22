import { Request, Response } from 'express';
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

export const sendMessagesController = catchAsync(async (req: Request, res: Response) => {
  await validate(sendMessageValidate(req))(req, res);
  const currentUser = req.user!;
  const conversationId = req.params.conversationId;
  const { title, type, imageList, replyTo, url } = req.body;
  const response = await sendMessageService({
    user: currentUser,
    conversationId: new mongoose.Types.ObjectId(conversationId),
    title,
    type,
    imageList,
    replyTo,
    url,
    t: req.t,
  });
  res.status(httpStatus.OK).json(response?.message);
});

export const getListMessageByConversationIdController = catchAsync(
  async (req: Request, res: Response) => {
    await validate(getListMessageByConversationIdValidate(req))(req, res);
    const user = req.user!;
    const query = pick(req.query, ['limit', 'page']);
    const conversationId = req.params.conversationId;

    const response = await getListMessageByConversationIdService({
      user,
      conversationId: new mongoose.Types.ObjectId(conversationId),
      page: query?.page,
      limit: query?.limit,
      t: req.t,
    });
    res.status(httpStatus.OK).json(response);
  }
);

export const pinMessageController = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user!;
  const conversationId = req.params.conversationId;
  const messageId = req.params.messageId;

  const response = await pinMessageService({
    currentUser,
    conversationId: new mongoose.Types.ObjectId(conversationId),
    messageId: new mongoose.Types.ObjectId(messageId),
    t: req.t,
  });
  res.status(httpStatus.OK).json(response);
});
