import {Router} from 'express';
import { protect } from '../middlewares/auth.js';
import { checkEligibility, dismissFeedback, recordShown, submitResponse } from '../controller/feedback.js';
import { validateFields, validateObjectId } from '../middlewares/validateFields.js';
import { feedbackValidator } from '../validator/feedbackValidator.js';

const router = Router();

router.get("/eligibility", protect, checkEligibility)
router.post("/shown", protect, recordShown)
router.patch("/response/:id", protect, feedbackValidator, validateFields, validateObjectId("id"), submitResponse)
router.patch("/dismiss/:id", protect, validateObjectId("id"), dismissFeedback)

export default router;