import { prisma } from '../lib/db.lib.js'

const insert = async (data) => {
    return prisma.rental.create({
        data: data,
    })
}

const findAll = async (where, { skip, take }) => {
    return prisma.rental.findMany({ where, skip, take })
}

const count = async (where) => {
    return prisma.rental.count({ where })
}

const findById = async (id) => {
    return prisma.rental.findUnique({
        where: { id: id },
    })
}

const findRentalDateConflict = async (
    { equipmentId, startDate, endDate },
    excludeId = null
) => {
    return prisma.rental.findFirst({
        where: {
            equipmentId,
            status: { in: ['PENDING', 'APPROVED'] },
            startDate: { lte: endDate },
            endDate: { gte: startDate },
            ...(excludeId && { id: { not: excludeId } }),
        },
    })
}

const update = async (id, data) => {
    return prisma.rental.update({
        where: {
            id: id,
        },
        data: data,
    })
}

export { insert, findAll, findById, update, count, findRentalDateConflict }
