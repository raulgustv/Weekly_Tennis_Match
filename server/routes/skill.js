import {Router} from 'express';
import { userVotesPerMatch, voteSkillLevel } from '../controller/skillVote.js';
import { protect } from '../middlewares/auth.js';
import { validateObjectId } from '../middlewares/validateFields.js';

const router = Router();

router.post("/match/:id", protect, validateObjectId("id"), voteSkillLevel)
router.get('/match/:matchId', protect, validateObjectId("matchId"),  userVotesPerMatch)

export default router;