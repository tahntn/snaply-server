import { Router } from 'express';

import { auth } from '../middlewares';
import {
  createConversationController,
  getConversationsController,
  getDetailConversationController,
  updateGroupConversationController,
} from '../controllers';
import messageRouter from './message.router';

const router = Router();

router
  .route('/')
  .post(auth(), createConversationController)
  .get(auth(), getConversationsController);

router.use('/:conversationId', messageRouter);

router
  .route('/:conversationId')
  .get(auth(), getDetailConversationController)
  .put(auth(), updateGroupConversationController);

export default router;
