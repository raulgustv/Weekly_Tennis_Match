import {Router} from 'express';
import { googleAuth, login, register, viewAllUsers, viewUser, resetPassword, resetPasswordEmail, completeProfile, validateEmail } from '../controller/user.js';
import { googleValidator, loginValidator, registerValidator } from '../validator/userValidator.js';
import { validateFields } from '../middlewares/validateFields.js';
import { protect, verifyAdmin } from '../middlewares/auth.js';


const router = Router();

router.post("/register", registerValidator, validateFields, register)
router.post("/login", loginValidator, validateFields, login)
router.post("/google", googleValidator, validateFields, googleAuth)
router.get("/validate", validateEmail)

router.post('/reset-password', resetPasswordEmail)

router.put("/complete-profile", protect, completeProfile)

router.get("/all-users", protect, verifyAdmin, viewAllUsers)
router.get("/:id", protect, verifyAdmin, viewUser)



export default router;