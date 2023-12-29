import { Router } from 'express';

import { auth, validate } from '../middlewares';
import { deleteConversation, getConversation, updateConversation } from '../validators';
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
  .get(validate(getConversation), getConversationByIdController)
  .patch(validate(updateConversation), updateConversationController)
  .delete(validate(deleteConversation), deleteConversationController);

export default router;
