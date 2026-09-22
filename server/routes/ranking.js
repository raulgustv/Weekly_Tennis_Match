import {Router} from 'express';
import { protect, verifyAdmin } from '../middlewares/auth.js';
import { readLimiter } from '../config/expressLimit.js';
import { validateFields, validateObjectId } from '../middlewares/validateFields.js';
import { closeRoundNow, generateRoundProposal, publishRankingRound, rankingRegistration, submitRankingResult, unRegisterRanking } from '../controller/ranking.js';
import { submitRankingResultValidator } from '../validator/rankingValidator.js';

const router = Router();

router.post("/register", protect, rankingRegistration);
router.post("/unregister", protect, unRegisterRanking)


router.post("/rounds/propose", protect, verifyAdmin, generateRoundProposal);
router.post("/rounds/publish", protect, verifyAdmin, publishRankingRound);
router.post("/rounds/close", protect, verifyAdmin, closeRoundNow);

router.post("/matches/result", protect, submitRankingResultValidator, validateFields, submitRankingResult);



export default router;