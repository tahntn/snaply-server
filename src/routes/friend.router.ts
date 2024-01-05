import { Router } from 'express';
import { auth } from '../middlewares';
import {
  confirmFriendRequestController,
  createFriendRequestController,
  denyFriendRequestController,
  getListFriendByUserIdController,
} from '../controllers';

const router = Router();

router.post('/create', auth(), createFriendRequestController);
router.post('/confirm/:id', auth(), confirmFriendRequestController);
router.post('/deny/:id', auth(), denyFriendRequestController);
router.get('/list', auth(), getListFriendByUserIdController);

export default router;
