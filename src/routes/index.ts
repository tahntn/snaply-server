import { Router } from 'express';
import auth from './auth.router';
import messages from './messages.router';
import conversations from './conversations.router';

const router = Router();

router.use('/auth', auth);
router.use('/messages', messages);
router.use('/conversations', conversations);
export default router;
