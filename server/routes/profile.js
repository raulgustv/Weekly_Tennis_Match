import express from "express";
import { protect } from "../middlewares/auth.js";
import { resetPassword, resetPasswordEmail, updateProfile, viewProfile } from "../controller/profile.js";

const router = express.Router();

router.get("/", protect, viewProfile); 
router.put('/update', protect, updateProfile)
router.post('/reset-password',  resetPasswordEmail);
router.post('/reset-password/:token', resetPassword)

export default router;