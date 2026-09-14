import { prisma } from '../config/db.js'

const insert = async (reservation) => {
    return prisma.reservation.create({
        data: reservation,
    })
}

const findAll = async (where, { skip, take }) => {
    return prisma.reservation.findMany({ where, skip, take })
}

const count = async (where) => {
    return prisma.reservation.count({ where })
}

const findById = async (id) => {
    return prisma.reservation.findUnique({
        where: { id: id },
    })
}

const findReservationConflict = async ({ equipmentId, startDate, endDate }) => {
    return prisma.reservation.findFirst({
        where: {
            equipmentId,
            status: { in: ['PENDING', 'APPROVED'] },
            startDate: { lte: endDate },
            endDate: { gte: startDate },
        },
    })
}

const findReservationConflictWithoutId = async (
    id,
    { equipmentId, startDate, endDate }
) => {
    return prisma.reservation.findFirst({
        where: {
            equipmentId,
            id: { not: id },
            status: { in: ['PENDING', 'APPROVED'] },
            startDate: { lte: endDate },
            endDate: { gte: startDate },
        },
    })
}

const update = async (id, data) => {
    return prisma.reservation.update({
        where: {
            id: id,
        },
        data: data,
    })
}

export {
    insert,
    findAll,
    findById,
    update,
    count,
    findReservationConflict,
    findReservationConflictWithoutId,
}
