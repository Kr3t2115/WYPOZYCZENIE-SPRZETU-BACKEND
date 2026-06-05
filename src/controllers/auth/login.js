import {prisma} from "../../config/db.js";
import bcrypt from 'bcryptjs';
import {generateToken} from "../../utils/generateToken.js";
import http from "http2";


/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Sprawdza czy użytkownik jest zalogowany
 *     description: Zwraca informację czy użytkownik posiada poprawną sesję lub token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@test.pl
 *               password:
 *                 type: string
 *                 example: mojeHaslo123
 *     responses:
 *       200:
 *         description: Użytkownik jest zalogowany
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logowanie udane
 *       401:
 *         description: Użytkownik nie jest zalogowany
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logowanie nieudane
 */


const login = async (req, res) => {
    const { nickname, password } = req.body;

    if(!nickname || !password || !password.length) {
        return res.status(http.constants.HTTP_STATUS_UNAUTHORIZED).json({
            message: "Brak wymaganych pól formularza !!!"
        })
    }

    const userExist = await prisma.user.findUnique({
        where: { nickName: nickname },
    });

    if (!userExist) {
        return res.status(http.constants.HTTP_STATUS_UNAUTHORIZED).json({
            message: "Taki użytkownik nie istnieje u nas w bazie !!!"
        })
    }

    const match = await bcrypt.compare(password, userExist.password);
    if(!match) {
        return res.status(http.constants.HTTP_STATUS_UNAUTHORIZED).json({
            message: "Błędne hasło"
        })
    }

    console.log(userExist.id);

    generateToken(userExist.id, res);

    return res.status(http.constants.HTTP_STATUS_OK).json({
        message: "Logowanie udane"
    });
}

export {login}