import {Router} from 'express';
import { protect, verifyAdmin } from '../middlewares/auth.js';
// CHANGE (NUEVO): + adminLimiter (cambio de fecha de cierre)
import { adminLimiter, readLimiter } from '../config/expressLimit.js';
// CHANGE (NUEVO): + updateRoundCloseDate
import { activateSeason, createSeason, listSeasons, updateRoundCloseDate } from '../controller/season.js';
// CHANGE (NUEVO): + validateFields
import { validateFields, validateObjectId } from '../middlewares/validateFields.js';
// CHANGE (NUEVO): validador del cambio de fecha de cierre
import { roundCloseDateValidator } from '../validator/seasonValidator.js';

const router = Router();

router.get("/", protect, verifyAdmin, listSeasons)
router.post("/", protect, verifyAdmin, createSeason)
router.post("/:id/activate", protect, verifyAdmin, validateObjectId("id"),  activateSeason)

// CHANGE (NUEVO): el admin extiende/adelanta el cierre de la ronda en juego (lluvia, festivos...)
router.patch("/:id/round-close", protect, verifyAdmin, adminLimiter, validateObjectId("id"), roundCloseDateValidator, validateFields, updateRoundCloseDate)

export default router;