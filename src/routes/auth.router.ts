import { Router } from 'express';
import {
  loginUserController,
  logoutController,
  refreshTokensController,
  registerUserController,
} from '../controllers';

const router = Router();

router.post('/login', loginUserController);
router.post('/register', registerUserController);
router.post('/logout', logoutController);
router.post('/refresh-tokens', refreshTokensController);

export default router;
