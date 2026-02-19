import express from "express";
import { protect } from "../middlewares/auth.js";
import { resetPassword, resetPasswordEmail, updateProfile, uploadProfilePicture, viewProfile } from "../controller/profile.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", protect, viewProfile); 
router.put('/update', protect, updateProfile)
router.post('/reset-password',  resetPasswordEmail);
router.post('/reset-password/:token', resetPassword)
router.post('/picture', protect, upload.single('image'),  uploadProfilePicture)

export default router;