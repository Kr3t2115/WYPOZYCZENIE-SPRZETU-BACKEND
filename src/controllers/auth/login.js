import http from 'http2'
import { getUserExistByEmail } from '../../repositories/userRepositories.js'
import { generateToken, verifyPassword } from '../../services/authServices.js'

const login = async (req, res) => {
    const { email, password } = req.body

    const userExist = await getUserExistByEmail(email)

    if (!userExist) {
        return res.status(http.constants.HTTP_STATUS_UNAUTHORIZED).json({
            message: 'Taki użytkownik nie istnieje u nas w bazie !!!',
        })
    }

    const match = await verifyPassword(password, userExist.password)

    if (!match) {
        return res.status(http.constants.HTTP_STATUS_UNAUTHORIZED).json({
            message: 'Błędne hasło',
        })
    }

    generateToken(userExist.id, res)

    return res.status(http.constants.HTTP_STATUS_OK).json({
        message: 'Logowanie udane',
    })
}

export { login }
