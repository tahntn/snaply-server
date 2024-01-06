import { Request, Response } from 'express';

import { httpStatus } from '../constant';
import { catchAsync, pick } from '../utils';
import {
  createConversationService,
  getConversationsService,
  getDetailConversationService,
} from '../services';
import mongoose from 'mongoose';
import { validate } from '../middlewares';
import { createConversation } from '../validators';
import { IConversation } from '../models';

export const createConversationController = catchAsync(async (req: Request, res: Response) => {
  await validate(createConversation(req))(req, res);
  const { participants, isGroup } = req.body as IConversation;
  const currentUser = req.user!;

  if (isGroup && participants.length < 2) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: req.t('conversation.createConversation.minParticipantsRequired'),
    });
  }
  2;
  if (!isGroup && participants.length !== 1) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: req.t('conversation.createConversation.exactOneParticipantRequired'),
    });
  }

  const response = await createConversationService({
    currentUser,
    data: req.body as IConversation,
    req,
  });
  res.status(httpStatus.OK).json({
    data: response?.conversation,
    code: httpStatus.OK,
    message: req.t('conversation.createConversation.createConversationSuccess'),
  });
});

export const getConversationsController = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user!;

  const query = pick(req.query, ['limit', 'page']);

  const response = await getConversationsService(currentUser, query);
  res.status(httpStatus.OK).json(response);
});

export const getDetailConversationController = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user!;
  const conversationId = req.params.conversationId;

  const response = await getDetailConversationService(
    new mongoose.Types.ObjectId(conversationId),
    currentUser,
    req.t
  );
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    data: response?.conversation,
  });
});
