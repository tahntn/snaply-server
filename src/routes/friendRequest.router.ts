import { Router } from 'express';
import { auth } from '../middlewares';
import { confirmFriendRequestController, createFriendRequestController } from '../controllers';

const router = Router();

router.post('/create', auth(), createFriendRequestController);
router.post('/confirm/:id', auth(), confirmFriendRequestController);

export default router;
