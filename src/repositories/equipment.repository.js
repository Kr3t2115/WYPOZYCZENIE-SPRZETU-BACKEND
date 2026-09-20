import { prisma } from '../lib/db.lib.js'

const insert = async (data) => {
    return prisma.equipment.create({
        data: data,
    })
}

const findAll = async (where, { skip, take }) => {
    return prisma.equipment.findMany({
        where,
        skip,
        take,
        include: { category: true, values: true },
    })
}

const count = async (where) => {
    return prisma.equipment.count({ where })
}

const findById = async (id) => {
    return prisma.equipment.findUnique({
        where: { id: id },
        include: { category: true, values: true },
    })
}

const countByCategoryId = async (categoryId) => {
    return prisma.equipment.count({
        where: { categoryId },
    })
}

const update = async (id, data) => {
    return prisma.equipment.update({
        where: {
            id: id,
        },
        data: data,
    })
}

export { insert, findById, findAll, update, count, countByCategoryId }
