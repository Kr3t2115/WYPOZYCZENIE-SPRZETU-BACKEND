import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as usersRepository from '../repositories/users.repository.js'
import { UnauthorizedError } from '../utils/errors.util.js'
import crypto from 'crypto'

const ACCESS_TOKEN_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m'
const REFRESH_TOKEN_EXPIRES_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES,
    })
}

const generateRefreshToken = async (user) => {
    const token = crypto.randomBytes(64).toString('hex')
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS)

    await usersRepository.createRefreshToken({
        token,
        userId: user.id,
        expiresAt,
    })

    return token
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

    const accessToken = generateAccessToken(user)
    const refreshToken = await generateRefreshToken(user)

    return { user, accessToken, refreshToken }
}

const refresh = async (refreshToken) => {
    if (!refreshToken) {
        throw new UnauthorizedError('Brak refresh tokena')
    }

    const stored = await usersRepository.findRefreshToken(refreshToken)

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
        throw new UnauthorizedError('Nieprawidłowy refresh token')
    }

    await usersRepository.revokeRefreshToken(refreshToken)

    const newAccessToken = generateAccessToken(stored.user)
    const newRefreshToken = await generateRefreshToken(stored.user)

    return {
        user: stored.user,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    }
}

const logout = async (refreshToken) => {
    if (refreshToken) {
        await usersRepository.revokeRefreshToken(refreshToken)
    }
}

export { login, logout, refresh }
