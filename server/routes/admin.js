import {Router} from 'express';
import { protect, verifyAdmin } from '../middlewares/auth.js';
import {  adminAdjustNTRP, closeMatch, removePlayerMatch, toggleAdminRole, togglePlayerActivation } from '../controller/admin.js';


const router = Router();

router.post('/close-match/:id', protect,verifyAdmin, closeMatch)
router.post('/player-activation/:id', protect,verifyAdmin, togglePlayerActivation)
router.post('/adjust-ntrp/:userId', protect,verifyAdmin, adminAdjustNTRP)
router.post('/remove-player/:matchId/:playerId', protect, verifyAdmin, removePlayerMatch)

router.post('/add-admin', protect, verifyAdmin, toggleAdminRole)


export default router;