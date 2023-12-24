import { Router } from 'express';
import { loginUserController } from '../controllers';
import { validateLogin } from '../validators';
import { validate } from '../middlewares';

const router = Router();

router.get('/login', validate(validateLogin), loginUserController);

export default router;
