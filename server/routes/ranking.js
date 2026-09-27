import {Router} from 'express';
import { protect, requireVerification, verifyAdmin } from '../middlewares/auth.js';
import { writeLimiter, adminLimiter } from '../config/expressLimit.js';
import { validateFields } from '../middlewares/validateFields.js';
import { closeRoundNow, generateRoundProposal, publishRankingRound, rankingRegistration, submitRankingResult, unRegisterRanking } from '../controller/ranking.js';
import { registerForRankingValidator, submitRankingResultValidator } from '../validator/rankingValidator.js';

const router = Router();

router.post("/register", protect, requireVerification, writeLimiter, registerForRankingValidator, validateFields, rankingRegistration);


router.post("/unregister", protect, writeLimiter, unRegisterRanking)

router.post("/rounds/propose", protect, verifyAdmin, adminLimiter, generateRoundProposal);
router.post("/rounds/publish", protect, verifyAdmin, adminLimiter, publishRankingRound);
router.post("/rounds/close", protect, verifyAdmin, adminLimiter, closeRoundNow);

router.post("/matches/result", protect, writeLimiter, submitRankingResultValidator, validateFields, submitRankingResult);



export default router;