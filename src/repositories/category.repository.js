import { prisma } from '../config/db.js'

const insert = async (category) => {
    return prisma.category.create({
        data: category,
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
const findByName = async (name) => {
    return prisma.category.findUnique({
        where: { name: name },
    })
}

const findByNameWithoutId = async (name, id) => {
    return prisma.category.findFirst({
        where: {
            AND: [
                { name: { equals: name, mode: 'insensitive' } },
                { id: { not: id } },
            ],
        },
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

export {
    insert,
    findAll,
    findById,
    findByName,
    findByNameWithoutId,
    update,
    count,
}
