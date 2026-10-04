import {Router} from 'express';
import { protect, requireVerification, verifyAdmin } from '../middlewares/auth.js';
// CHANGE: añadido readLimiter (GET de rondas)
import { writeLimiter, adminLimiter, readLimiter } from '../config/expressLimit.js';
// CHANGE: añadido validateObjectId (valida :seasonId)
import { validateFields, validateObjectId } from '../middlewares/validateFields.js';
// CHANGE: añadidos getRoundOverview y discardRoundProposal
import { closeRoundNow, discardRoundProposal, generateRoundProposal, getRoundOverview, publishRankingRound, rankingRegistration, submitRankingResult, unRegisterRanking } from '../controller/ranking.js';
// CHANGE: añadidos proposeRoundValidator, roundActionValidator y roundOverviewValidator
import { proposeRoundValidator, registerForRankingValidator, roundActionValidator, roundOverviewValidator, submitRankingResultValidator } from '../validator/rankingValidator.js';

const router = Router();

router.post("/register", protect, requireVerification, writeLimiter, registerForRankingValidator, validateFields, rankingRegistration);


router.post("/unregister", protect, writeLimiter, unRegisterRanking)

// CHANGE (NUEVO): resumen de rondas + partidos de una ronda (solo admin)
router.get("/rounds/:seasonId", protect, verifyAdmin, readLimiter, validateObjectId("seasonId"), roundOverviewValidator, validateFields, getRoundOverview);

// CHANGE: añadidos proposeRoundValidator / roundActionValidator + validateFields (antes sin validación)
router.post("/rounds/propose", protect, verifyAdmin, adminLimiter, proposeRoundValidator, validateFields, generateRoundProposal);
router.post("/rounds/publish", protect, verifyAdmin, adminLimiter, roundActionValidator, validateFields, publishRankingRound);
// CHANGE (NUEVO): descartar una propuesta sin publicar
router.post("/rounds/discard", protect, verifyAdmin, adminLimiter, roundActionValidator, validateFields, discardRoundProposal);
router.post("/rounds/close", protect, verifyAdmin, adminLimiter, closeRoundNow);

router.post("/matches/result", protect, writeLimiter, submitRankingResultValidator, validateFields, submitRankingResult);



export default router;