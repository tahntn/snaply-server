import { Router } from 'express';
import { auth } from '../middlewares';
import {
  confirmFriendRequestController,
  createFriendRequestController,
  denyFriendRequestController,
  getListFriendByUserIdController,
  getListFriendSortByAlphabetController,
  getTotalListFriendController,
} from '../controllers';

const router = Router();

router.post('/create/:userId', auth(), createFriendRequestController);
router.post('/confirm/:friendRequestId', auth(), confirmFriendRequestController);
router.post('/deny/:friendRequestId', auth(), denyFriendRequestController);
router.get('/list', auth(), getListFriendByUserIdController);
router.get('/list-v2', auth(), getListFriendSortByAlphabetController);
router.get('/total', auth(), getTotalListFriendController);
export default router;
