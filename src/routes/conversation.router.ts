import { Router } from 'express';

import { auth } from '../middlewares';
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
  .post(auth(), createConversationController)
  .get(auth(), getConversationsController);
router
  .route('/:conversationId')
  .get(auth(), getConversationByIdController)
  .patch(auth(), updateConversationController)
  .delete(auth(), deleteConversationController);

export default router;
