import { prisma } from '../lib/db.lib.js'

const insert = async (data) => {
    return prisma.category.create({
        data: data,
    })
}

const findAll = async (where, { skip, take }) => {
    return prisma.category.findMany({ where, skip, take })
}

const count = async (where) => {
    return prisma.category.count({ where })
}

const findById = async (id) => {
    return prisma.category.findUnique({
        where: { id: id },
    })
}
const findByName = async (name, excludeId = null) => {
    return prisma.category.findUnique({
        where: { name: name },
        ...(excludeId && { id: { not: excludeId } }),
    })
}

const update = async (id, data) => {
    return prisma.category.update({
        where: {
            id: id,
        },
        data: data,
    })
}

export { insert, findAll, findById, findByName, update, count }
