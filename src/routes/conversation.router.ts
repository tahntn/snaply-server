import { Router } from 'express';

import { auth, validate } from '../middlewares';
import {
  // createConversation,
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
  .post(auth(), createConversationController)
  .get(validate(getConversations), getConversationsController);

router
  .route('/:conversationId')
  .get(validate(getConversation), auth(), getConversationByIdController)
  .patch(validate(updateConversation), updateConversationController)
  .delete(validate(deleteConversation), deleteConversationController);

export default router;
