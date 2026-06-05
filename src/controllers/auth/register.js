import {prisma} from "../../config/db.js";
import bcrypt from 'bcryptjs';
import { v4 as uuid4 } from 'uuid';

const register = async (req, res) => {
    const { nickname, email, password, rePassword } = req.body;

    if(!email || !nickname || !password || !rePassword) {
        res.status(401).json({
            message: 'Brak wymaganych pól formularza',
        })
    }

    const userExist = await prisma.user.findFirst({
        where: {
            email: email
        },
    });

    if (userExist) {
        res.status(401).json({
            message: "Użytkownik o takim mailu już istnieje!!!"
        })
    }

    if(password !== rePassword) {
        res.status(401).json({
            message: "Hasło lub powtórzone hasło nie są takie same"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
            nickName: nickName,
            id: uuid4(),
        }
    })

    res.status(201).json({
        message: "Zarejestrowano nowego użytkownika"
    });
}

export {register}