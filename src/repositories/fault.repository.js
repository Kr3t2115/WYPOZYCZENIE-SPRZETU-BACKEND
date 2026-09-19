import { prisma } from '../config/db.config.js'

const insert = async (reservation) => {
    return prisma.fault.create({
        data: reservation,
    })
}

const findAll = async (where, { skip, take }) => {
    return prisma.fault.findMany({ where, skip, take })
}

const count = async (where) => {
    return prisma.fault.count({ where })
}

const findById = async (id) => {
    return prisma.fault.findUnique({
        where: { id: id },
    })
}

const update = async (id, data) => {
    return prisma.fault.update({
        where: {
            id: id,
        },
        data: data,
    })
}

export { insert, findAll, findById, update, count }
