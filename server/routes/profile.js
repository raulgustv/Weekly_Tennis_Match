import express from "express";
import { protect } from "../middlewares/auth.js";
import { getTotalFunds, resetPassword, resetPasswordEmail, updateProfile, uploadProfilePicture, viewProfile } from "../controller/profile.js";
import upload from "../middlewares/upload.js";
import { changePasswordLimiter, readLimiter, uploadLimiter, writeLimiter } from "../config/expressLimit.js";

const router = express.Router();

router.get("/", protect, readLimiter, viewProfile); 
router.get("/wallet-balance", protect, readLimiter, getTotalFunds); 
router.put('/update', protect, writeLimiter, updateProfile)
router.post('/reset-password', changePasswordLimiter,  resetPasswordEmail);
router.post('/reset-password/:token', resetPassword)
router.post('/picture', protect, uploadLimiter, upload.single('image'),  uploadProfilePicture)

export default router;