import { Router } from 'express';

import {
  getUserByIdController,
  searchUserNameController,
  updateUserController,
} from '../controllers';
import { auth } from '../middlewares';

const router = Router();

router.put('/:id', auth(), updateUserController);
router.get('/search', auth(), searchUserNameController);
router.get('/:id', auth(), getUserByIdController);

export default router;
