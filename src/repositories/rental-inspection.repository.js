import { prisma } from '../lib/db.lib.js'

const insert = async (data) => {
    return prisma.rentalInspection.create({
        data: data,
    })
}

const findAll = async (where, { skip, take }) => {
    return prisma.rentalInspection.findMany({
        where,
        skip,
        take,
        include: { photos: true },
    })
}

const count = async (where) => {
    return prisma.rentalInspection.count({ where })
}

const findById = async (id) => {
    return prisma.rentalInspection.findUnique({
        where: { id: id },
        include: { photos: true },
    })
}

const findByToken = async (token) => {
    return prisma.rentalInspection.findUnique({
        where: { uploadToken: token },
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

export { insert, findAll, findById, update, count, findByToken }
