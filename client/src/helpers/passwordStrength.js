export const calculateStrength = (value) => {
    if (!value) return 0;

    let score = 0;

    const length = value.length;
    score += Math.min(30, length * 2);

    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSymbol = /[^A-Za-z0-9]/.test(value);

    const varietyCounter = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

    score += varietyCounter * 10;

    if (hasUpper && hasLower && hasNumber) score += 10;
    if (hasSymbol) score += 10;

    if (/(.)\1{2,}/.test(value)) score -= 10;
    if (/123|abc|qwe/i.test(value)) score -= 10;
    if (/^[a-zA-Z]+$/.test(value) || /^[0-9]+$/.test(value)) score -= 10;

    return Math.max(0, Math.min(100, score))

}

export const getStrengthLevel = (score) =>{
    if(score < 30) return {label: "Weak", color: "FF4D4F"}
    if(score < 60) return {label: "Fair", color: "FAAD14"}
    if(score < 80) return {label: "Good", color: "1890FF"}

    return {label: "Strong", color: "52C41A"}

}