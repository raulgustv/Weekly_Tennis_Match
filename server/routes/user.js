import {Router} from 'express';
import { refresh, login, logout, register, viewAllUsers, viewUser, resetPassword, resetPasswordEmail, completeProfile, validateEmail, completeOnboarding, getMeAuth, adminNote, userNotes, suspendUser } from '../controller/user.js';
import { googleValidator, loginValidator, noteValidator, registerValidator } from '../validator/userValidator.js';
import { validateFields, validateObjectId } from '../middlewares/validateFields.js';
import { protect, verifyAdmin } from '../middlewares/auth.js';
import { adminLimiter, authLimiter, changePasswordLimiter, readLimiter, refreshLimiter, registerLimiter } from '../config/expressLimit.js';
//import { verify } from 'crypto';


const router = Router();

router.post("/register", registerLimiter, registerValidator, validateFields, register)
router.post("/login", authLimiter, loginValidator, validateFields, login)
router.get('/auth', protect,  getMeAuth)
router.post('/refresh', refreshLimiter, refresh)
router.post('/logout', logout)
//router.post("/google", googleValidator, validateFields, googleAuth)
router.get("/validate", validateEmail)

router.post('/reset-password', changePasswordLimiter, resetPasswordEmail)

router.put("/complete-profile", protect, completeProfile)
router.put("/onboarding-complete", protect, completeOnboarding)

router.get("/all-users", protect, verifyAdmin, readLimiter, viewAllUsers)
router.get("/:id", protect, verifyAdmin, validateObjectId("id"), viewUser)

router.post('/:id', protect, verifyAdmin,  validateObjectId("id"), noteValidator, validateFields,  adminNote)
router.get('/notes/:id', protect, verifyAdmin, userNotes)

router.post('/suspend/:id', protect, verifyAdmin, suspendUser)




export default router;