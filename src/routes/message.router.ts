import { Router } from 'express';

import { auth, validate } from '../middlewares';
import { deleteMessage, getMessage, getMessages, sendMessage, updateMessage } from '../validators';
import {
  deleteMessageController,
  getAllMessagesController,
  getMessageByIdController,
  sendMessagesController,
  updateMessageController,
} from '../controllers';

const router = Router();

router
  .route('/')
  .post(auth(), validate(sendMessage), sendMessagesController)
  .get(validate(getMessages), getAllMessagesController);

router
  .route('/:messageId')
  .get(validate(getMessage), getMessageByIdController)
  .patch(validate(updateMessage), updateMessageController)
  .delete(validate(deleteMessage), deleteMessageController);

export default router;
