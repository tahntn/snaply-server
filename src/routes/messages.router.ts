import { Router } from 'express';
import { deleteMessage, getMessage, getMessages, sendMessage, updateMessage } from '../validators';
import { validate } from '../middlewares';
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
  .post(validate(sendMessage), sendMessagesController)
  .get(validate(getMessages), getAllMessagesController);

router
  .route('/:messageId')
  .get(validate(getMessage), getMessageByIdController)
  .patch(validate(updateMessage), updateMessageController)
  .delete(validate(deleteMessage), deleteMessageController);

export default router;
