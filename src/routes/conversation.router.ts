import { Router } from 'express';

import { auth } from '../middlewares';
import {
  createConversationController,
  getListMessageByConversationIdController,
  getConversationsController,
} from '../controllers';

const router = Router();

router
  .route('/')
  .post(auth(), createConversationController) //tạo
  .get(auth(), getConversationsController); //get các conversation của user
router.route('/:conversationId').get(auth(), getListMessageByConversationIdController); //get tin nhắn của conversation

export default router;
