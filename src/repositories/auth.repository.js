import { prisma } from '../lib/db.lib.js'

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

export { findByEmail, findById, updateLastLogin }
