import { prisma } from '../lib/db.lib.js'

const insert = async (data) => {
    return prisma.categoryAttribute.create({
        data: data,
    })
}

const findAll = async (where, { skip, take }) => {
    return prisma.categoryAttribute.findMany({
        orderBy: {
            order: 'asc',
        },
        where,
        skip,
        take,
        include: {
            category: true,
            attribute: true,
        },
    })
}

const count = async (where) => {
    return prisma.categoryAttribute.count({ where })
}

const countAttributesForCategory = async (categoryId) => {
    return prisma.categoryAttribute.count({
        where: {
            categoryId: categoryId,
        },
    })
}

const findById = async (id) => {
    return prisma.categoryAttribute.findUnique({
        where: { id: id },
        include: {
            category: true,
            attribute: true,
        },
    })
}

const findByCategoryIdAndAttributeId = async ({ categoryId, attributeId }) => {
    return prisma.categoryAttribute.findFirst({
        where: {
            AND: [{ categoryId: categoryId }, { attributeId: attributeId }],
        },
    })
}

const remove = async (id) => {
    return prisma.categoryAttribute.delete({
        where: { id: id },
    })
}

const update = async (id, data) => {
    return prisma.categoryAttribute.update({
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
    findByCategoryIdAndAttributeId,
    update,
    count,
    countAttributesForCategory,
    remove,
}
