import { Router } from 'express';

import {
  getUserByIdController,
  searchUserNameController,
  updateUserController,
} from '../controllers';

const router = Router();

router.put('/:id', updateUserController);
router.get('/search', searchUserNameController);
router.get('/:id', getUserByIdController);

export default router;
