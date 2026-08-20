import { body } from "express-validator";
import mongoose from "mongoose";

export const createNotificationValidator = [
    body("type")
        .trim()
        .notEmpty().withMessage("Notification type is required")
        .isIn(["tour", "update"])
        .withMessage("Type must be tour or update"),

    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ min: 2, max: 80 })
        .withMessage("Title must have between 2 and 150 characters"),

    body("description")
        .trim()
        .notEmpty().withMessage("Description is required")
        .isLength({ min: 1, max: 280 })
        .withMessage("Description cannot exceed 5000 characters"),

    body("tag")
        .optional()
        .trim()
        .isIn(["New", "Improvement", "Bug Fix", "Coming soon"])
        .withMessage(
            "Tag must be New, Improvement, Bug Fix or Coming soon"
        ),

    body("version")
        .optional({ values: "null" })
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage("Version must have between 1 and 30 characters")
        .custom((value, { req }) => {
            if (req.body.type === "tour" && !value) {
                throw new Error("Version is required for tour notifications");
            }

            if (req.body.type === "update" && value) {
                throw new Error(
                    "Version must not be provided for update notifications"
                );
            }

            return true;
        }),

    body("order")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Order must be a positive integer or zero")
        .custom((value, { req }) => {
            if (req.body.type === "update" && Number(value) !== 0) {
                throw new Error(
                    "Order must be 0 for update notifications"
                );
            }

            return true;
        }),

    body("active")
        .optional()
        .isBoolean()
        .withMessage("Active must be a boolean"),
];


export const seenNotificationsValidator = [
    body("ids")
        .notEmpty()
        .withMessage("Ids are required")
        .isArray({ min: 1 })
        .withMessage("Ids must be a non empty array"),

    body("ids.*")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error(`Invalid notification id: ${value}`);
            }

            return true;
        }),
];