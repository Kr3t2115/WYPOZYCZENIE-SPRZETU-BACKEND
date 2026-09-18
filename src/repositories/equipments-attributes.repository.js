import { prisma } from '../config/db.config.js'

const insert = async (equipmentAttribute) => {
    return prisma.equipmentAttribute.create({
        data: equipmentAttribute,
    })
}

const findAll = async (where, { skip, take }) => {
    return prisma.equipmentAttribute.findMany({
        where,
        skip,
        take,
    })
}

const count = async (where) => {
    return prisma.equipmentAttribute.count({ where })
}

const findById = async (id) => {
    return prisma.equipmentAttribute.findUnique({
        where: { id: id },
    })
}

const findByEquipmentAndAttributeId = async (equipmentId, attributeId) => {
    return prisma.equipmentAttribute.findFirst({
        where: { attributeId: attributeId, equipmentId: equipmentId },
    })
}

const update = async (id, data) => {
    return prisma.equipmentAttribute.update({
        where: {
            id: id,
        },
        data: data,
    })
}

export {
    insert,
    findById,
    findAll,
    update,
    count,
    findByEquipmentAndAttributeId,
}
