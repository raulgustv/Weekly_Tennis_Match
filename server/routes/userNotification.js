import express from "express";
import { protect } from "../middlewares/auth.js";
import {readLimiter, writeLimiter } from "../config/expressLimit.js";
import { createNotification, getNotifications, seenNotifications } from "../controller/userNotification.js";

const router = express.Router();

router.get("/", protect, readLimiter, getNotifications); 
router.post("/create", protect, writeLimiter, createNotification); 
router.post("/seen", protect, writeLimiter, seenNotifications); 


export default router;