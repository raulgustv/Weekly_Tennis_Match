
import {Router} from 'express';
import { protect } from '../middlewares/auth.js';
import { saveFCMToken } from '../controller/notification.js';

const router = Router();

router.post('/token', protect, saveFCMToken)

export default router;