import {Router} from 'express';
import { protect, verifyAdmin, verifyBookerOrAdmin } from '../middlewares/auth.js';
// 🔵 CAMBIO: se importa updatePlayerPaymentMethod (nuevo)
import {  adminAdjustNTRP, closeMatch, getAdmins, removePlayerMatch, toggleAdminRole, togglePaymentStatus, togglePlayerActivation, updatePaymentRecepient, updatePlayerPaymentMethod } from '../controller/admin.js';
import { validateObjectId } from '../middlewares/validateFields.js';


const router = Router();

router.post('/close-match/:id', protect,verifyAdmin, validateObjectId("id"), closeMatch)
router.post('/player-activation/:id', protect,verifyAdmin, validateObjectId("id"), togglePlayerActivation)
router.post('/adjust-ntrp/:userId', protect,verifyAdmin, validateObjectId("userId"), adminAdjustNTRP)
// 🔵 CAMBIO: era verifyAdmin (solo admin), ahora verifyBookerOrAdmin
// (admin o booker pueden retirar jugadores/backups, incluso <24h).
router.post('/remove-player/:matchId/:playerId', protect, verifyBookerOrAdmin, validateObjectId("playerId"), removePlayerMatch)

router.post('/add-admin', protect, verifyAdmin, toggleAdminRole)
// 🔵 CAMBIO: se añade validateObjectId para matchId y userId (antes un id
// mal formado llegaba al controlador y acababa en CastError -> 500).
router.put('/payment/:matchId/:userId', protect, verifyBookerOrAdmin, validateObjectId("matchId"), validateObjectId("userId"), togglePaymentStatus)
// 🔵 NUEVO: cambiar el método de pago de un jugador (pre y post partido).
router.put('/payment-method/:matchId/:userId', protect, verifyBookerOrAdmin, validateObjectId("matchId"), validateObjectId("userId"), updatePlayerPaymentMethod)

//wallet
router.get('/get-admin', protect, verifyAdmin, getAdmins)
router.post('/update-recepient/:id', protect, verifyAdmin, validateObjectId("id"), updatePaymentRecepient)
//router.post('/update/payment', protect, verifyAdmin)


export default router;