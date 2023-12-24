import { Router } from 'express';

import auth from './auth.router';
import user from './user.router';
const router = Router();

router.use('/auth', auth);
router.use('/user', user);

export default router;
