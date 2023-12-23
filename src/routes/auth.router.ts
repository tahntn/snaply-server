import { Router } from 'express';
import { loginUserController } from '../controllers';

const router = Router();

router.post('/login', loginUserController);

export default router;
