/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { validate } from '../middlewares';
import {
  createConversation,
  deleteConversation,
  getConversation,
  getConversations,
  updateConversation,
} from '../validators';
import {
  createConversationController,
  deleteConversationController,
  getConversationByIdController,
  getConversationsController,
  updateConversationController,
} from '../controllers';

const router = Router();

router
  .route('/')
  .post('createConversation' as any, validate(createConversation), createConversationController)
  .get('getConversations' as any, validate(getConversations), getConversationsController);

router
  .route('/:conversationId')
  .get('getConversation' as any, validate(getConversation), getConversationByIdController)
  .patch('updateConversation' as any, validate(updateConversation), updateConversationController)
  .delete('deleteConversation' as any, validate(deleteConversation), deleteConversationController);

export default router;
