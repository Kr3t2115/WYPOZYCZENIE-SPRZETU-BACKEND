import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const generateToken =  (userId, res) => {
    const payload = {userId: userId};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '2d',
    });

    res.cookie('access_token', token, {
        domain: process.env.DOMAIN,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: 1000*60*60*24*2, // 1000 (miliseconds) * 60 (seconds) * 60 (minutes) * 24 (hours) * 2 (days)
    });

    return token;
}

const verifyPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}



export {verifyPassword, generateToken}