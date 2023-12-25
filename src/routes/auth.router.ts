import { Router } from 'express';
import {
  loginUserController,
  logoutController,
  refreshTokensController,
  registerUserController,
} from '../controllers';
import {
  validateLogin,
  validateLogout,
  validateRefreshTokens,
  validateRegister,
} from '../validators';
import { validate } from '../middlewares';

const router = Router();

router.post('/login', validate(validateLogin), loginUserController);
router.post('/register', validate(validateRegister), registerUserController);
router.post('/logout', validate(validateLogout), logoutController);
router.post('/refresh-tokens', validate(validateRefreshTokens), refreshTokensController);

export default router;
