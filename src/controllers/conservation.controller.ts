/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';

import { httpStatus } from '../constant';
import { catchAsync, pick } from '../utils';
import {
  createConversationService,
  getConversationByIdService,
  getConversationsService,
} from '../services';
import { IUser, User } from '../models';
import { IQueryUser, IRequest } from '../types';

export const createConversationController = catchAsync(async (req: Request, res: Response) => {
  const { participants } = req.body;
  const users = req.user as IUser;

  //check participant
  if (!participants || !Array.isArray(participants) || participants?.length < 1) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please provide complete information with at least two participants.',
    });
  }
  if (!users) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'User is not existing',
    });
  }

  const response = await createConversationService({
    user: users,
    participants,
  });
  res.status(httpStatus.OK).json(response);
});

export const getConversationsController = catchAsync(async (req: IRequest, res: Response) => {
  const currentUser = req.user;

  const query: IQueryUser = pick(req.query, ['limit', 'page']);

  if (!currentUser) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'User is not existing',
    });
  }

  const response = await getConversationsService(currentUser, query);
  res.status(httpStatus.OK).json(response);
});

export const getConversationByIdController = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const query = pick(req.query, ['limit', 'page']);
  if (!user) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'User is not existing',
    });
  }

  if (!req.params.conversationId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please provide keyword',
    });
  }

  const response = await getConversationByIdService({
    user,
    conversationId: req.params.conversationId as string,
    page: query?.page,
    limit: query?.limit,
  });
  res.status(httpStatus.OK).json(response);
});

export const updateConversationController = catchAsync(async (req: Request, res: Response) => {});
export const deleteConversationController = catchAsync(async (req: Request, res: Response) => {});
