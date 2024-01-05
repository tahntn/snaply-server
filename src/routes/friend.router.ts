import { Router } from 'express';
import { auth } from '../middlewares';
import {
  confirmFriendRequestController,
  createFriendRequestController,
  denyFriendRequestController,
} from '../controllers';

const router = Router();

router.post('/create/:userId', auth(), createFriendRequestController);
router.post('/confirm/:friendRequestId', auth(), confirmFriendRequestController);
router.post('/deny/:friendRequestId', auth(), denyFriendRequestController);

export default router;
