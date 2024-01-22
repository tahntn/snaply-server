import { Router } from 'express';

import { auth } from '../middlewares';
import {
  createConversationController,
  getConversationsController,
  getDetailConversationController,
  typingMessageController,
  updateGroupConversationController,
} from '../controllers';
import messageRouter from './message.router';

const router = Router();

router
  .route('/')
  .post(auth(), createConversationController)
  .get(auth(), getConversationsController);

router.use('/:conversationId', messageRouter);
router.post('/:conversationId/typing', auth(), typingMessageController);

router
  .route('/:conversationId')
  .get(auth(), getDetailConversationController)
  .patch(auth(), updateGroupConversationController);

export default router;
