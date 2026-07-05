import { prisma } from '../config/db.js'

const insert = async (attribute) => {
    return prisma.attribute.create({
        data: attribute,
    })
}

const findAll = async () => {
    return prisma.attribute.findMany()
}

const findById = async (id) => {
    return prisma.attribute.findUnique({
        where: { id: id },
    })
}
const findByName = async (name) => {
    return prisma.attribute.findUnique({
        where: { name: name },
    })
}

const findByNameWithoutId = async (name, id) => {
    return prisma.attribute.findFirst({
        where: {
            AND: [
                { name: { equals: name, mode: 'insensitive' } },
                { id: { not: id } },
            ],
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

export { insert, findAll, findById, findByName, findByNameWithoutId, update }
