
import {Router} from 'express';
import { protect, verifyAdmin, verifyBookerOrAdmin } from '../middlewares/auth.js';
import { acceptInvite, addMatchCourts, 
declineInvite, generateMatches, getAllMatches,
getMatch, getOpenMatch, joinMatch, 
leaveMatch, newMatch, removeMatchCourts,
updateGeneratedMatches,
updateMatch, updateMatchStatus } from '../controller/match.js';
import { createMatchValidator } from '../validator/matchCreateValidator.js';
import { validateFields, validateObjectId } from '../middlewares/validateFields.js';
import { matchLimiter, readLimiter, viewMatchesLimiter, writeLimiter } from '../config/expressLimit.js';
import { saveFCMToken } from '../controller/notification.js';

const router = Router();

router.post('/token', protect, saveFCMToken)

export default router;