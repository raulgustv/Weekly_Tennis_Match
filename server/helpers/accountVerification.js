import crypto from "crypto";

export const generateVerificationCode = () => {
    // 6 dígitos, con ceros a la izquierda si hace falta
    return String(crypto.randomInt(0, 1000000)).padStart(6, "0");
};

export const hashVerificationCode = (code) => {
    return crypto.createHash("sha256").update(code).digest("hex");
};