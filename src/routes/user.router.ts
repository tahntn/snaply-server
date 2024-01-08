import { Router } from 'express';

import {
  getDetailUserByIdController,
  getMeController,
  searchUserNameController,
  updateUserController,
} from '../controllers';
import { auth } from '../middlewares';

const router = Router();

router.get('/get-me', auth(), getMeController);
router.get('/search', auth(), searchUserNameController);
router.get('/:id', auth(), getDetailUserByIdController);
router.patch('/', auth(), updateUserController);

export default router;
