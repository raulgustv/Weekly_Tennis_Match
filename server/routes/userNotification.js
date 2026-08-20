import express from "express";
import { protect } from "../middlewares/auth.js";
import {readLimiter, writeLimiter } from "../config/expressLimit.js";
import { createNotification, getNotifications, seenNotifications } from "../controller/userNotification.js";
import { createNotificationValidator, seenNotificationsValidator } from "../validator/notificationValidator.js";
import { validateFields } from "../middlewares/validateFields.js";

const router = express.Router();

router.get("/", protect, readLimiter, getNotifications); 
router.post("/create", protect, writeLimiter, createNotificationValidator,validateFields , createNotification); 
router.post("/seen", protect, writeLimiter, seenNotificationsValidator, validateFields, seenNotifications); 


export default router;