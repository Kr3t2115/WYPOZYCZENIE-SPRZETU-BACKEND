import { prisma } from '../config/db.config.js'

const insert = async (reservation) => {
    return prisma.rentalExtension.create({
        data: reservation,
    })
}

const findAll = async (where, { skip, take }) => {
    return prisma.rentalExtension.findMany({ where, skip, take })
}

const count = async (where) => {
    return prisma.rentalExtension.count({ where })
}

const findById = async (id) => {
    return prisma.rentalExtension.findUnique({
        where: { id: id },
    })
}

const update = async (id, data) => {
    return prisma.rentalExtension.update({
        where: {
            id: id,
        },
        data: data,
    })
}

export { insert, findAll, findById, update, count }
