import {Router} from 'express';
import {  login, register, viewAllUsers, viewUser, resetPassword, resetPasswordEmail, completeProfile, validateEmail, completeOnboarding, getMeAuth, adminNote } from '../controller/user.js';
import { googleValidator, loginValidator, registerValidator } from '../validator/userValidator.js';
import { validateFields, validateObjectId } from '../middlewares/validateFields.js';
import { protect, verifyAdmin } from '../middlewares/auth.js';
import { authLimiter, registerLimiter } from '../config/expressLimit.js';


const router = Router();

router.post("/register", registerValidator, validateFields, register)
router.post("/login", authLimiter, loginValidator, validateFields, login)
router.get('/auth', protect, getMeAuth)
//router.post("/google", googleValidator, validateFields, googleAuth)
router.get("/validate", validateEmail)

router.post('/reset-password', resetPasswordEmail)

router.put("/complete-profile", protect, completeProfile)
router.put("/onboarding-complete", protect, completeOnboarding)

router.get("/all-users", protect, verifyAdmin, viewAllUsers)
router.get("/:id", protect, verifyAdmin, validateObjectId("id"), viewUser)
router.post('/:id', protect, verifyAdmin, validateObjectId("id"), adminNote)




export default router;