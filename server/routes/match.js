import {Router} from 'express';
import { protect, verifyAdmin } from '../middlewares/auth.js';
import { acceptInvite, addMatchCourts, 
declineInvite, generateMatches, getAllMatches,
getMatch, getOpenMatch, joinMatch, 
leaveMatch, newMatch, removeMatchCourts,
updateGeneratedMatches,
updateMatch, updateMatchStatus } from '../controller/match.js';
import { createMatchValidator } from '../validator/matchCreateValidator.js';
import { validateFields, validateObjectId } from '../middlewares/validateFields.js';

const router = Router();

router.post('/new', protect,verifyAdmin, createMatchValidator, validateFields, newMatch)
router.put('/update/:id', protect,verifyAdmin, validateObjectId("id"), updateMatch)
router.post('/update-status/:id', protect,verifyAdmin, validateObjectId("id"), updateMatchStatus)
router.get('/view-open-match', protect, getOpenMatch)
router.get('/view-all', protect, getAllMatches)
router.get('/view-match/:id', protect, validateObjectId("id"), getMatch)

//post match creation
router.post('/join/:id', protect, validateObjectId("id"), joinMatch)
router.post('/leave/:matchId', protect, validateObjectId("matchId"), leaveMatch)
router.post('/invite/accept', acceptInvite)
router.post('/invite/decline', declineInvite)

router.post('/generate/:id', protect, verifyAdmin, validateObjectId("id"), generateMatches)
router.put('/update-generate/:matchId', protect, verifyAdmin, validateObjectId("matchId"), updateGeneratedMatches)
router.post('/remove-courts/:matchId/:courtNumber', protect, verifyAdmin, removeMatchCourts)
router.post('/add-courts/:matchId', protect, verifyAdmin, validateObjectId("id"),  addMatchCourts)

export default router;