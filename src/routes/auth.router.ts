import { Router } from 'express';
import { loginUserController, registerUserController } from '../controllers';
import { validateLogin } from '../validators';
import { validate } from '../middlewares';

const router = Router();

router.get('/login', validate(validateLogin), loginUserController);
router.post('/register', registerUserController);

export default router;
