import { prisma } from '../lib/db.lib.js'

const createResetToken = async ({ token, userId, expiresAt }) => {
    return prisma.passwordResetToken.create({
        data: { token, userId, expiresAt },
    })
}

const findResetToken = async (token) => {
    return prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
    })
}

const markTokenAsUsed = async (token) => {
    return prisma.passwordResetToken.update({
        where: { token },
        data: { used: true },
    })
}

const invalidateUserTokens = async (userId) => {
    return prisma.passwordResetToken.updateMany({
        where: { userId, used: false },
        data: { used: true },
    })
}

export {
    createResetToken,
    findResetToken,
    markTokenAsUsed,
    invalidateUserTokens,
}
