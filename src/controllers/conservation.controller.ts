import { Request, Response } from 'express';

import { httpStatus } from '../constant';
import { catchAsync, pick } from '../utils';
import {
  createConversationService,
  getConversationsService,
  getDetailConversationService,
} from '../services';
import mongoose from 'mongoose';

export const createConversationController = catchAsync(async (req: Request, res: Response) => {
  const { participants } = req.body;
  const user = req.user!;

  //check participant
  if (!participants || !Array.isArray(participants) || participants?.length < 1) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: req.t('conversation.error.atLeastTwoParticipants'),
    });
  }

  const response = await createConversationService({
    user: user,
    participants,
    req,
  });
  res.status(httpStatus.OK).json(response);
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
