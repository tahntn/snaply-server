import { Router } from 'express';

import { auth } from '../middlewares';
import {
  createConversationController,
  // deleteConversationController,
  getConversationByIdController,
  getConversationsController,
  // updateConversationController,
} from '../controllers';

const router = Router();

router
  .route('/')
  .post(auth(), createConversationController)  //tạo
  .get(auth(), getConversationsController); //get các conversation của user
router
  .route('/:conversationId')
  .get(auth(), getConversationByIdController)   //get tin nhắn của conversation
  // .patch(auth(), updateConversationController)
  // .delete(auth(), deleteConversationController);

export default router;
