import jwt from 'jsonwebtoken'
import * as authRepository from '../repositories/users.repository.js'
import { UnauthorizedError } from '../utils/errors.util.js'

export const authMiddleware = async (req, res, next) => {
    try {
        let token

        if (req.cookies && req.cookies.access_token) {
            token = req.cookies.access_token
        }

        if (!token) {
            return next(new UnauthorizedError('Nie podano tokena'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await authRepository.findById(decoded.id)

        if (!user) {
            return next(new UnauthorizedError('Nie podano tokena'))
        }

        if (!user.isActive) {
            return next(
                new UnauthorizedError(
                    'Użytkownik nieaktywny, zgłoś się do dziekanatu'
                )
            )
        }

        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}
