import { Router } from 'express';
import auth from './auth.router';
import messages from './messages.router';
import conversations from './conversations.router';
import user from './user.router';

const router = Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/messages', messages);
router.use('/conversations', conversations);

export default router;
