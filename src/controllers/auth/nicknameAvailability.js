import {prisma} from "../../config/db.js";
import http from "http2";

const nicknameAvailability = async (req, res) => {
    const nickname = req.params.nickname;

    if (!nickname) {
        return res.status(http.constants.HTTP_STATUS_NOT_FOUND).json({
            message: "Brak wymaganych pól formularza !!!"
        })
    }

    const userExist = await prisma.user.findFirst({
        where: {
            nickName: nickname
        },
    });
}

export {nicknameAvailability}