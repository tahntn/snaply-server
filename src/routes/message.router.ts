import { Router } from 'express';
import { auth } from '../middlewares';
import {
  getListMessageByConversationIdController,
  pinMessageController,
  sendMessagesController,
} from '../controllers';

const router = Router({ mergeParams: true });
const itemRouter = Router({ mergeParams: true });
const messageRouter = Router({ mergeParams: true });

router.use('/message', itemRouter);

itemRouter
  .route('/')
  .post(auth(), sendMessagesController)
  .get(auth(), getListMessageByConversationIdController);

itemRouter.use('/:messageId', messageRouter);

messageRouter.route('/pin').post(pinMessageController);

export default router;
