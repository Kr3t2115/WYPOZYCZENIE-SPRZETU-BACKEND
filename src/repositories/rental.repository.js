import { prisma } from '../lib/db.lib.js'
import { endOfDay, startOfDay } from '../utils/date.util.js'
import { RentalStatus } from '@prisma/client'

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
const findActiveDueOn = async (date) => {
    const start = startOfDay(date)
    const end = endOfDay(date)

    return prisma.rental.findMany({
        where: {
            status: RentalStatus.ACTIVE,
            dueDate: { gte: start, lte: end },
        },
        include: { equipment: true, student: true },
    })
}

const findNewlyOverdue = async (today) => {
    return prisma.rental.findMany({
        where: {
            status: RentalStatus.ACTIVE,
            dueDate: { lt: startOfDay(today) },
        },
        include: { equipment: true, student: true },
    })
}

export {
    insert,
    findAll,
    findById,
    update,
    count,
    findRentalDateConflict,
    findActiveDueOn,
    findNewlyOverdue,
}
