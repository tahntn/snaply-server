import { Router } from 'express';

import auth from './auth.router';
import message from './message.router';
import conversation from './conversation.router';
import user from './user.router';
import friendRequest from './friendRequest.router';

const router = Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/message', message);
router.use('/conversation', conversation);
router.use('/friend-request', friendRequest);

export default router;
