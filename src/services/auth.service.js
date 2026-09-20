import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as usersRepository from '../repositories/users.repository.js'
import { UnauthorizedError } from '../utils/errors.util.js'

const generateToken = (userId) => {
    const payload = { userId: userId }
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '2d',
    })
}

const verifyPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

const login = async (userFormData) => {
    const user = await usersRepository.findByEmail(userFormData.email)

    if (!user) {
        throw new UnauthorizedError('Brak użytkownika w bazie')
    }

    const match = await verifyPassword(userFormData.password, user.password)

    if (!match) {
        throw new UnauthorizedError('Niepoprawne dane logowania')
    }

    await usersRepository.updateLastLogin(user.id)

    const token = generateToken(user.id)

    return { user, token }
}

export { login }
