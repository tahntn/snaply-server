import { Router } from 'express';
import { auth } from '../middlewares';
import {
  confirmFriendRequestController,
  confirmFriendRequestController2,
  createFriendRequestController,
} from '../controllers';

const router = Router();

router.post('/create', auth(), createFriendRequestController);
router.post('/confirm/:id', auth(), confirmFriendRequestController);
router.post('/confirm-request/:id', auth(), confirmFriendRequestController2);

export default router;
