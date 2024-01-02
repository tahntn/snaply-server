import { Router } from 'express';

import { auth } from '../middlewares';

import {
  deleteMessageController,
  getAllMessagesController,
  getMessageByIdController,
  sendMessagesController,
  updateMessageController,
} from '../controllers';

const router = Router();

router.route('/').post(auth(), sendMessagesController).get(auth(), getAllMessagesController);

router
  .route('/:messageId')
  .get(auth(), getMessageByIdController)
  .patch(auth(), updateMessageController)
  .delete(auth(), deleteMessageController);

export default router;
