import { Router } from 'express';
import { loginUserController, registerUserController } from '../controllers';
import { validateLogin, validateRegister } from '../validators';
import { validate } from '../middlewares';

const router = Router();

router.post('/login', validate(validateLogin), loginUserController);
router.post('/register', validate(validateRegister), registerUserController);

export default router;
