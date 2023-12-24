/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { deleteMessage, getMessage, getMessages, sendMessage, updateMessage } from '../validators';
import { validate } from '../middlewares';
import {
  deleteMessageController,
  getMessageByIdController,
  getMessagesController,
  sendMessagesController,
  updateMessageController,
} from '../controllers';

const router = Router();

router
  .route('/')
  .post('sendMessage' as any, validate(sendMessage), sendMessagesController)
  .get('getMessages' as any, validate(getMessages), getMessagesController);

router
  .route('/:messageId')
  .get('getMessage' as any, validate(getMessage), getMessageByIdController)
  .patch('updateMessage' as any, validate(updateMessage), updateMessageController)
  .delete('deleteMessage' as any, validate(deleteMessage), deleteMessageController);

export default router;
