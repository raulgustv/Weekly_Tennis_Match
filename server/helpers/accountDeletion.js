import crypto from 'crypto'

export const generateDeleteAccountToken = () =>{
    return crypto.randomBytes(32).toString("hex")
}

export const hashDeleteAccountToken = (token) =>{
    return crypto.createHash("sha256").update(token).digest("hex")
}