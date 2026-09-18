import { prisma } from '../config/db.config.js'

const findByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email: email },
    })
}

export { findByEmail }
