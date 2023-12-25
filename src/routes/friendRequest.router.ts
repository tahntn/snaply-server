import { Router } from 'express';
import { auth } from '../middlewares';
import { createFriendRequestController } from '../controllers';

const router = Router();

router.post('/create', auth(), createFriendRequestController);

export default router;
