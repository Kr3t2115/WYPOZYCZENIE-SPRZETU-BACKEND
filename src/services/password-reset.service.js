import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import * as passwordResetRepository from '../repositories/password-reset.repository.js'
import * as userRepository from '../repositories/users.repository.js'
import { BadRequestError } from '../utils/errors.util.js'
import { renderTemplate } from '../utils/template.util.js'
import { send } from '../lib/mailer.lib.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const passwordResetTemplate = fs.readFileSync(
    path.join(__dirname, '../templates/auth/password-reset.template.html'),
    'utf-8'
)

const RESET_TOKEN_EXPIRES_MS = 1000 * 60 * 30

const sendMail = async (email, resetLink) => {
    const body = renderTemplate(passwordResetTemplate, {
        resetLink: resetLink,
    })

    await send({
        to: email,
        subject: 'wypożyczSANie - Resetowanie hasła',
        html: body,
        text: 'wypożyczSANie - Resetowanie hasła',
    })
}

const requestPasswordReset = async (email) => {
    const user = await userRepository.findByEmail(email)

    if (!user) {
        return
    }

    await passwordResetRepository.invalidateUserTokens(user.id)

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_MS)

    await passwordResetRepository.createResetToken({
        token,
        userId: user.id,
        expiresAt,
    })

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    await sendMail(user.email, resetLink)
}

const verifyResetToken = async (token) => {
    const resetToken = await passwordResetRepository.findResetToken(token)

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
        throw new BadRequestError(
            'Link do resetowania hasła jest nieprawidłowy lub wygasł'
        )
    }

    return true
}

const resetPassword = async (token, newPassword) => {
    const resetToken = await passwordResetRepository.findResetToken(token)

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
        throw new BadRequestError(
            'Link do resetowania hasła jest nieprawidłowy lub wygasł'
        )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await userRepository.updateUserPassword(resetToken.userId, hashedPassword)
    await passwordResetRepository.markTokenAsUsed(token)
}

export { requestPasswordReset, verifyResetToken, resetPassword }
