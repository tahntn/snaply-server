import { Router } from 'express';
import { searchUserNameController, updateUserController } from '../controllers';
const router = Router();

router.put('/:id', updateUserController);
router.get('/search', searchUserNameController);

export default router;
