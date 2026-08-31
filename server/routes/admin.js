import {Router} from 'express';
import { protect, verifyAdmin, verifyBookerOrAdmin } from '../middlewares/auth.js';
import {  adminAdjustNTRP, closeMatch, getAdmins, removePlayerMatch, toggleAdminRole, togglePaymentStatus, togglePlayerActivation, updatePaymentRecepient } from '../controller/admin.js';
import { validateObjectId } from '../middlewares/validateFields.js';


const router = Router();

router.post('/close-match/:id', protect,verifyAdmin, validateObjectId("id"), closeMatch)
router.post('/player-activation/:id', protect,verifyAdmin, validateObjectId("id"), togglePlayerActivation)
router.post('/adjust-ntrp/:userId', protect,verifyAdmin, validateObjectId("userId"), adminAdjustNTRP)
router.post('/remove-player/:matchId/:playerId', protect, verifyAdmin, validateObjectId("playerId"), removePlayerMatch)

router.post('/add-admin', protect, verifyAdmin, toggleAdminRole)
router.put('/payment/:matchId/:userId', protect, verifyBookerOrAdmin, togglePaymentStatus)

//wallet
router.get('/get-admin', protect, verifyAdmin, getAdmins)
router.post('/update-recepient/:id', protect, verifyAdmin, validateObjectId("id"), updatePaymentRecepient)
//router.post('/update/payment', protect, verifyAdmin)


export default router;