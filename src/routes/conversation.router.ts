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
  .post(auth(), createConversationController)
  .get(auth(), getConversationsController);
router.route('/:conversationId').get(auth(), getListMessageByConversationIdController);

export default router;
