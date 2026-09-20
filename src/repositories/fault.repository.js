import { prisma } from '../lib/db.lib.js'

const insert = async (data) => {
    return prisma.fault.create({
        data: data,
    })
}

const findAll = async (where, { skip, take }) => {
    return prisma.fault.findMany({
        where,
        skip,
        take,
        include: { photos: true },
    })
}

const count = async (where) => {
    return prisma.fault.count({ where })
}

const findById = async (id) => {
    return prisma.fault.findUnique({
        where: { id: id },
        include: { photos: true },
    })
}

const findByToken = async (token) => {
    return prisma.fault.findUnique({
        where: { uploadToken: token },
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

export { insert, findAll, findById, update, count, findByToken }
