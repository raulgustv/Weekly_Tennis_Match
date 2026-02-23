import {Router} from 'express';
import { protect, verifyAdmin } from '../middlewares/auth.js';
import {  adminAdjustNTRP, closeMatch, removePlayerMatch, toggleAdminRole, togglePlayerActivation } from '../controller/admin.js';
import { validateObjectId } from '../middlewares/validateFields.js';


const router = Router();

router.post('/close-match/:id', protect,verifyAdmin, validateObjectId("id"), closeMatch)
router.post('/player-activation/:id', protect,verifyAdmin, validateObjectId("id"), togglePlayerActivation)
router.post('/adjust-ntrp/:userId', protect,verifyAdmin, validateObjectId("userId"), adminAdjustNTRP)
router.post('/remove-player/:matchId/:playerId', protect, verifyAdmin, validateObjectId("playerId"), removePlayerMatch)

router.post('/add-admin', protect, verifyAdmin, toggleAdminRole)


export default router;