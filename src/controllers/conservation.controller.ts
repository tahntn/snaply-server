/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';

import { httpStatus } from '../constant';
import { catchAsync } from '../utils';
import { createConversationService } from '../services';

export const createConversationController = catchAsync(async (req: Request, res: Response) => {
  const { participants } = req.body;

  //check participant
  if (!participants || !Array.isArray(participants) || participants?.length < 2) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: 'Please provide complete information with at least two participants.',
    });
  }

  const response = await createConversationService();
  res.status(httpStatus.OK).json(response);
});
export const getConversationsController = catchAsync(async (req: Request, res: Response) => {});
export const getConversationByIdController = catchAsync(async (req: Request, res: Response) => {});
export const updateConversationController = catchAsync(async (req: Request, res: Response) => {});
export const deleteConversationController = catchAsync(async (req: Request, res: Response) => {});
