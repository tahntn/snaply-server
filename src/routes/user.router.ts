import { Router } from 'express';

import {
  changePasswordController,
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
router.patch('/change-password', auth(), changePasswordController);
router.patch('/', auth(), updateUserController);

export default router;
