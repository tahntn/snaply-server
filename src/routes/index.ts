import { Router } from 'express';
import auth from './auth.router';
import message from './message.router';
import conversation from './conversation.router';
import user from './user.router';

const router = Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/message', message);
router.use('/conversation', conversation);

export default router;
