import {Router} from 'express';
import { protect, requireVerification, verifyAdmin } from '../middlewares/auth.js';
import { writeLimiter, adminLimiter, readLimiter } from '../config/expressLimit.js';
import { validateFields, validateObjectId } from '../middlewares/validateFields.js';
import { issueRankingPenalty, removePlayerFromRanking } from '../controller/rankingPenalty.js';
import { issuePenaltyValidator, removeFromRankingValidator } from '../validator/rankingValidator.js';

const router = Router();

router.post("/issue", protect, verifyAdmin, adminLimiter, issuePenaltyValidator, validateFields, issueRankingPenalty);
router.post("/player/:userId/remove", protect, verifyAdmin, adminLimiter, validateObjectId("userId"), removeFromRankingValidator, validateFields, removePlayerFromRanking);


export default router;