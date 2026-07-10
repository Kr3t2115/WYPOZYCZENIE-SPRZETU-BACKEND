import { prisma } from '../config/db.js'

const insert = async (categoryAttribute) => {
    return prisma.categoryAttribute.create({
        data: categoryAttribute,
    })
}

const findAll = async (where, { skip, take }) => {
    return prisma.categoryAttribute.findMany({ where, skip, take })
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
            attributes: true,
        },
    })
}

const findByCategoryId = async (categoryId) => {
    return prisma.categoryAttribute.findMany({
        where: { categoryId: categoryId },
    })
}

const findByCategoryIdAndAttributeId = async ({ categoryId, attributeId }) => {
    return prisma.categoryAttribute.findFirst({
        where: {
            AND: [
                { categoryId: { equals: categoryId } },
                { attributeId: { equals: attributeId } },
            ],
        },
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
    findByCategoryId,
    findByCategoryIdAndAttributeId,
    update,
    count,
    countAttributesForCategory,
}
