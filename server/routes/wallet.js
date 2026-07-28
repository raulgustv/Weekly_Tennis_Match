import { Router } from "express";
import { addFunds, allDeposits, confirmDeposit, pendingDeposits, refundAdjustments, rejectDeposit, userDeposits } from "../controller/wallet.js";
import { protect, verifyAdmin } from "../middlewares/auth.js";
import { validateFields, validateObjectId } from "../middlewares/validateFields.js";
import { addFundsValidator } from "../validator/walletValidator.js";
import { addFundsLimiter, adminLimiter, readLimiter, writeLimiter } from "../config/expressLimit.js";

const router = Router();

router.post('/', protect, addFundsLimiter, addFundsValidator, validateFields, addFunds)
router.post('/confirm/:id', protect, verifyAdmin, adminLimiter, validateObjectId('id'), confirmDeposit)
router.post('/reject/:id', protect, verifyAdmin, adminLimiter, validateObjectId('id'), rejectDeposit)
router.post('/refund-adjust', protect, verifyAdmin, adminLimiter, refundAdjustments)
router.get('/pending', protect, verifyAdmin, readLimiter, pendingDeposits)
router.get('/', protect, verifyAdmin, readLimiter, allDeposits)
router.get('/user/funds', protect, readLimiter, userDeposits)


export default router;