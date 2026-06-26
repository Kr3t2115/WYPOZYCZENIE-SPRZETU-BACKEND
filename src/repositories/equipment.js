import { prisma } from '../config/db.js'

const createEquipment = async (equipment) => {
    return prisma.equipment.create({
        data: equipment,
    })
}

const getAllEquipments = async () => {
    return prisma.equipment.findMany()
}

const getEquipmentById = async (id) => {
    return prisma.equipment.findUnique({
        where: { id: id },
    })
}

const update = async (id, data) => {
    return prisma.equipment.update({
        where: {
            id: id,
        },
        data: {
            name: data.name,
            serialNumber: data.serialNumber,
            inventoryNumber: data.inventoryNumber,
            categoryId: data.categoryId,
        },
    })
}

export { createEquipment, getAllEquipments, getEquipmentById, update }
