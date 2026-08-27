import { prisma } from '../config/db.js'

const insert = async (attributeOption) => {
    return prisma.attributeOption.create({
        data: attributeOption,
    })
}

const findAll = async (where, { skip, take }) => {
    return prisma.attributeOption.findMany({
        where,
        skip,
        take,
        orderBy: {
            order: 'asc',
        },
    })
}

const count = async (where) => {
    return prisma.attributeOption.count({ where })
}

const findById = async (id) => {
    return prisma.attributeOption.findUnique({
        where: { id: id },
    })
}

const findByAttributeIdAndValue = async ({ attributeId, value }) => {
    return prisma.attributeOption.findFirst({
        where: {
            attributeId: attributeId,
            value: {
                equals: value,
                mode: 'insensitive',
            },
        },
    })
}
const findByAttributeIdAndValueWithoutId = async (attributeId, value, id) => {
    return prisma.attributeOption.findFirst({
        where: {
            attributeId: attributeId,
            value: {
                equals: value,
                mode: 'insensitive',
            },
            id: {
                not: id,
            },
        },
    })
}

const update = async (id, data) => {
    return prisma.attributeOption.update({
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
    update,
    count,
    findByAttributeIdAndValue,
    findByAttributeIdAndValueWithoutId,
}
