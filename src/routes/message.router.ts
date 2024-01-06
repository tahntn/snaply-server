import { Router } from 'express';
import { auth } from '../middlewares';
import { getListMessageByConversationIdController, sendMessagesController } from '../controllers';

const router = Router({ mergeParams: true });

router
  .route('/message')
  .post(auth(), sendMessagesController)
  .get(auth(), getListMessageByConversationIdController);

export default router;
