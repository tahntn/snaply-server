import { Router } from 'express';

import auth from './auth.router';
import conversation from './conversation.router';
import user from './user.router';
import friend from './friend.router';
import upload from './upload.router';

const router = Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/conversation', conversation);
router.use('/friend', friend);
router.use('/upload', upload);

export default router;
