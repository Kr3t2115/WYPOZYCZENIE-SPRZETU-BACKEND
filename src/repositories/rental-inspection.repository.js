import { prisma } from '../config/db.config.js'

const insert = async (reservation) => {
    return prisma.rentalInspection.create({
        data: reservation,
    })
}

const findAll = async (where, { skip, take }) => {
    return prisma.rentalInspection.findMany({ where, skip, take })
}

const count = async (where) => {
    return prisma.rentalInspection.count({ where })
}

const findById = async (id) => {
    return prisma.rentalInspection.findUnique({
        where: { id: id },
    })
}

const update = async (id, data) => {
    return prisma.rentalInspection.update({
        where: {
            id: id,
        },
        data: data,
    })
}

export { insert, findAll, findById, update, count }
