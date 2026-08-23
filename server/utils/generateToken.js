// utils/tokens.js
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
};

export const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

export const generateRefreshToken = () =>
    crypto.randomBytes(64).toString("hex");

export const setRefreshCookie = (res, raw, expiresAt) => {
    res.cookie("refreshToken", raw, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/user", // <- coincide con tu prefix real
        expires: expiresAt
    });
};