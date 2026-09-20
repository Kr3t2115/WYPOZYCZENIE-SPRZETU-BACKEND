import { prisma } from '../lib/db.lib.js'

const findAll = async (where, { skip, take }) => {
    return prisma.user.findMany({
        where,
        skip,
        take,
        select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            lastLogin: true,
        },
    })
}

const count = async (where) => {
    return prisma.user.count({ where })
}

const update = async (id, data) => {
    return prisma.user.update({
        where: {
            id: id,
        },
        data: data,
    })
}

const findByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email: email },
    })
}

const findById = async (id) => {
    return prisma.user.findUnique({
        where: { id: id },
        select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            lastLogin: true,
        },
    })
}

const updateLastLogin = async (id) => {
    return prisma.user.update({
        where: { id: id },
        data: {
            lastLogin: new Date(),
        },
    })
}

const createRefreshToken = async ({ token, userId, expiresAt }) => {
    return prisma.refreshToken.create({
        data: { token, userId, expiresAt },
    })
}

const findRefreshToken = async (token) => {
    return prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
    })
}

const revokeRefreshToken = async (token) => {
    return prisma.refreshToken.updateMany({
        where: { token },
        data: { revoked: true },
    })
}

export {
    findByEmail,
    findById,
    updateLastLogin,
    findAll,
    count,
    update,
    createRefreshToken,
    findRefreshToken,
    revokeRefreshToken,
}
