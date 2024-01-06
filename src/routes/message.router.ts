import { Router } from 'express';
import { auth } from '../middlewares';
import { sendMessagesController } from '../controllers';

const router = Router({ mergeParams: true });

router.route('/').post(auth(), sendMessagesController);

export default router;
