import {Router} from 'express';
import { userVotesPerMatch, voteSkillLevel } from '../controller/skillVote.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post("/match/:id", protect, voteSkillLevel)
router.get('/match/:matchId', protect, userVotesPerMatch)

export default router;