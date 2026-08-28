import {Router} from 'express';
import { protect, requireVerification, verifyAdmin, verifyBookerOrAdmin } from '../middlewares/auth.js';
import { acceptInvite, addMatchCourts, 
declineInvite, generateMatches, getAllMatches,
getMatch, getOpenMatch, joinMatch, 
leaveMatch, newMatch, removeMatchCourts,
updateGeneratedMatches,
updateMatch, updateMatchStatus } from '../controller/match.js';
import { createMatchValidator } from '../validator/matchCreateValidator.js';
import { validateFields, validateObjectId } from '../middlewares/validateFields.js';
import { matchLimiter, viewMatchesLimiter, writeLimiter } from '../config/expressLimit.js';

const router = Router();

router.post('/new', protect, verifyBookerOrAdmin, requireVerification, writeLimiter, createMatchValidator, validateFields, newMatch)
router.put('/update/:id', protect,verifyBookerOrAdmin, validateObjectId("id"), updateMatch)
router.post('/update-status/:id', protect,verifyBookerOrAdmin, validateObjectId("id"), updateMatchStatus)
router.get('/view-open-match', protect, viewMatchesLimiter, getOpenMatch)
router.get('/view-all', protect, viewMatchesLimiter, getAllMatches)
router.get('/view-match/:id', protect, viewMatchesLimiter, validateObjectId("id"), getMatch)

//post match creation
router.post('/join/:id', protect, requireVerification, matchLimiter, validateObjectId("id"), joinMatch)
router.post('/leave/:matchId', protect, writeLimiter, validateObjectId("matchId"), leaveMatch)
router.post('/invite/accept', acceptInvite)
router.post('/invite/decline', declineInvite)

router.post('/generate/:id', protect, verifyAdmin, validateObjectId("id"), generateMatches)
router.put('/update-generate/:matchId', protect, verifyBookerOrAdmin, validateObjectId("matchId"), updateGeneratedMatches)
router.post('/remove-courts/:matchId/:courtNumber', protect, verifyBookerOrAdmin, removeMatchCourts)
router.post('/add-courts/:matchId', protect, verifyBookerOrAdmin, validateObjectId("matchId"),  addMatchCourts)

export default router;