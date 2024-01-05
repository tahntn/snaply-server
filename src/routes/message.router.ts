import { Router } from 'express';

import { auth } from '../middlewares';

import {
  sendMessagesController,
  // deleteMessageController,
  // getAllMessagesController,
  // getMessageByIdController,
  // updateMessageController,
} from '../controllers';

const router = Router();

router.route('/').post(auth(), sendMessagesController); // gửi tin nhắn
// .get(auth(), getAllMessagesController);

// router
//   .route('/:messageId')
//   .get(auth(), getMessageByIdController)
//   .patch(auth(), updateMessageController)
//   .delete(auth(), deleteMessageController);

export default router;
