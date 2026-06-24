import { prisma } from '../config/db.js'

const createEquipment = async (equipment) => {
    return prisma.equipment.create({
        data: equipment,
    })
}

export { createEquipment }
