import { Router } from "express";
import { addFunds, allDeposits, confirmDeposit, pendingDeposits, rejectDeposit, userDeposits } from "../controller/wallet.js";
import { protect, verifyAdmin } from "../middlewares/auth.js";
import { validateFields, validateObjectId } from "../middlewares/validateFields.js";
import { addFundsValidator } from "../validator/walletValidator.js";

const router = Router();

router.post('/', protect, addFundsValidator, validateFields, addFunds)
router.post('/confirm/:id', protect, verifyAdmin, validateObjectId('id'), confirmDeposit)
router.post('/reject/:id', protect, verifyAdmin, validateObjectId('id'), rejectDeposit)
router.get('/pending', protect, verifyAdmin, pendingDeposits)
router.get('/', protect, verifyAdmin, allDeposits)
router.get('/user/funds', protect, userDeposits)


export default router;