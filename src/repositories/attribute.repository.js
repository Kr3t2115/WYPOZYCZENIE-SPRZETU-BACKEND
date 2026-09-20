import { prisma } from '../lib/db.lib.js'

const insert = async (data) => {
    return prisma.attribute.create({
        data: data,
    })
}

const findAll = async (where, { skip, take }) => {
    return prisma.attribute.findMany({ where, skip, take })
}

const count = async (where) => {
    return prisma.attribute.count({ where })
}

const findById = async (id) => {
    return prisma.attribute.findUnique({
        where: { id: id },
        include: {
            options: true,
        },
    })
}

const findByName = async (name, excludeId = null) => {
    return prisma.attribute.findFirst({
        where: {
            name: { equals: name, mode: 'insensitive' },
            ...(excludeId && { id: { not: excludeId } }),
        },
        include: {
            options: true,
        },
    })
}

const update = async (id, data) => {
    return prisma.attribute.update({
        where: {
            id: id,
        },
        data: data,
    })
}

export { insert, findAll, findById, findByName, update, count }
