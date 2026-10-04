import {Router} from 'express';
import { protect, requireVerification, verifyAdmin } from '../middlewares/auth.js';
// CHANGE: añadido readLimiter (GET de rondas)
import { writeLimiter, adminLimiter, readLimiter } from '../config/expressLimit.js';
// CHANGE: añadido validateObjectId (valida :seasonId)
import { validateFields, validateObjectId } from '../middlewares/validateFields.js';
// CHANGE: añadidos getRoundOverview y discardRoundProposal
// CHANGE (NUEVO): añadidos getMyRankingMatch, getPublicStandings y getPublicRoundMatches (vista del jugador)
import { adminSetRankingResult, closeRoundNow, discardRoundProposal, generateRoundProposal, getMyRankingMatch, getPublicRoundMatches, getPublicStandings, getRoundOverview, publishRankingRound, rankingRegistration, submitRankingResult, unRegisterRanking } from '../controller/ranking.js';
// CHANGE: añadidos proposeRoundValidator, roundActionValidator y roundOverviewValidator
// CHANGE (NUEVO): + adminResultValidator
import { adminResultValidator, proposeRoundValidator, registerForRankingValidator, roundActionValidator, roundOverviewValidator, submitRankingResultValidator } from '../validator/rankingValidator.js';

const router = Router();

router.post("/register", protect, requireVerification, writeLimiter, registerForRankingValidator, validateFields, rankingRegistration);


router.post("/unregister", protect, writeLimiter, unRegisterRanking)

// CHANGE (NUEVO): vista del jugador — su partido de la ronda publicada + historial
router.get("/me/match", protect, readLimiter, getMyRankingMatch);
// CHANGE (NUEVO): clasificación pública de la temporada activa (sin rating ni penalizaciones)
router.get("/standings", protect, readLimiter, getPublicStandings);
// CHANGE (NUEVO): partidos publicados de la temporada activa (todos los jugadores). ?round=N opcional
// (roundOverviewValidator ya valida `round` como entero ≥ 1 en la query)
router.get("/matches", protect, readLimiter, roundOverviewValidator, validateFields, getPublicRoundMatches);

// CHANGE (NUEVO): resumen de rondas + partidos de una ronda (solo admin)
router.get("/rounds/:seasonId", protect, verifyAdmin, readLimiter, validateObjectId("seasonId"), roundOverviewValidator, validateFields, getRoundOverview);

// CHANGE: añadidos proposeRoundValidator / roundActionValidator + validateFields (antes sin validación)
router.post("/rounds/propose", protect, verifyAdmin, adminLimiter, proposeRoundValidator, validateFields, generateRoundProposal);
router.post("/rounds/publish", protect, verifyAdmin, adminLimiter, roundActionValidator, validateFields, publishRankingRound);
// CHANGE (NUEVO): descartar una propuesta sin publicar
router.post("/rounds/discard", protect, verifyAdmin, adminLimiter, roundActionValidator, validateFields, discardRoundProposal);
router.post("/rounds/close", protect, verifyAdmin, adminLimiter, closeRoundNow);

router.post("/matches/result", protect, writeLimiter, submitRankingResultValidator, validateFields, submitRankingResult);

// CHANGE (NUEVO): el admin fija o corrige el resultado de un partido (disputas, errores)
router.put("/matches/:id/result", protect, verifyAdmin, adminLimiter, adminResultValidator, validateFields, adminSetRankingResult);



export default router;