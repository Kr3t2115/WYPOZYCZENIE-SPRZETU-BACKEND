/**
 * @openapi
 * /api/auth/isLogged:
 *   get:
 *     summary: Sprawdza czy użytkownik jest zalogowany
 *     description: Zwraca informację czy użytkownik posiada poprawną sesję lub token.
 *     tags:
 *       - Auth
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

const isLogged = async (req, res) => {
    if (req.user) {
        return res.status(200).json({
            message: "Logowanie udane"
        });
    }
    else {
        return res.status(401).json({
            message: "Logowanie nieudane sadeg"
        });
    }
}

export {isLogged}