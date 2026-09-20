import { prisma } from '../lib/db.lib.js'

const insert = async (data) => {
    return prisma.attributeOption.create({
        data: data,
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

const findByAttributeIdAndValue = async (
    attributeId,
    value,
    excludeId = null
) => {
    return prisma.attributeOption.findFirst({
        where: {
            attributeId: attributeId,
            value: {
                equals: value,
                mode: 'insensitive',
            },
            ...(excludeId && { id: { not: excludeId } }),
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

export { insert, findAll, findById, update, count, findByAttributeIdAndValue }
