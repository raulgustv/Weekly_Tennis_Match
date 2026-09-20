import {Router} from 'express';
import { protect, verifyAdmin } from '../middlewares/auth.js';
import { readLimiter } from '../config/expressLimit.js';
import { activateSeason, createSeason, listSeasons } from '../controller/season.js';
import { validateObjectId } from '../middlewares/validateFields.js';

const router = Router();

router.get("/", protect, verifyAdmin, listSeasons)
router.post("/", protect, verifyAdmin, createSeason)
router.post("/:id/activate", protect, verifyAdmin, validateObjectId("id"),  activateSeason)

export default router;