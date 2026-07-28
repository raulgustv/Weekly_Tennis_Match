import {Router} from 'express';
import { userVotesPerMatch, voteSkillLevel } from '../controller/skillVote.js';
import { protect } from '../middlewares/auth.js';
import { validateObjectId } from '../middlewares/validateFields.js';
import { readLimiter } from '../config/expressLimit.js';

const router = Router();

router.post("/match/:id", protect, validateObjectId("id"), voteSkillLevel)
router.get('/match/:matchId', protect, readLimiter, validateObjectId("matchId"),  userVotesPerMatch)

export default router;