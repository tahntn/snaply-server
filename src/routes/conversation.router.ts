import { Router } from 'express';

import { auth } from '../middlewares';
import {
  createConversationController,
  getConversationsController,
  getDetailConversationController,
} from '../controllers';
import messageRouter from './message.router';

const router = Router();

router
  .route('/')
  .post(auth(), createConversationController)
  .get(auth(), getConversationsController);

router.use('/:conversationId', messageRouter);

router.route('/:conversationId').get(auth(), getDetailConversationController);

export default router;
