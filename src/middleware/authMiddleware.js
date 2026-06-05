import jwt from "jsonwebtoken"
import {prisma} from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.access_token) {
        token = req.cookies.access_token;
    }

    if (!token) {
        return res.status(401).json({error: 'No token provided'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

       const user = await prisma.user.findUnique({
           where: {
               id: decoded.userId,
           }
       })

        if(!user) {
            return res.status(401).json({error: 'No token provided'});
        }

        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({error: 'No token provided'});
    }
}
