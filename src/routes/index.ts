import { Router } from 'express';

import auth from './auth.router';
import conversation from './conversation.router';
import user from './user.router';
import friend from './friend.router';

const router = Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/conversation', conversation);
router.use('/friend', friend);

export default router;
