import { prisma } from '../config/db.js'

const createAttribute = async (attribute) => {
    return prisma.attribute.create({
        data: attribute,
    })
}

const getAllAttributes = async () => {
    return prisma.attribute.findMany()
}

const getAttributeById = async (id) => {
    return prisma.attribute.findUnique({
        where: { id: id },
    })
}
const getAttributeByName = async (name) => {
    return prisma.attribute.findUnique({
        where: { name: name },
    })
}

const getAttributeByNameWithoutId = async (name, id) => {
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
        data: {
            name: data.name,
            type: data.type,
            unit: data.unit,
        },
    })
}

export {
    createAttribute,
    getAllAttributes,
    getAttributeById,
    update,
    getAttributeByName,
    getAttributeByNameWithoutId,
}
