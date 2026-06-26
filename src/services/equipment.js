import {
    createEquipment,
    getAllEquipments,
    getEquipmentById,
    update as updateEquipment,
} from '../repositories/equipment.js'
import { ConflictError } from '../utils/errors.js'
import { getById as getEquipmentCategoryById } from '../repositories/equipmentCategory.js'

const create = async (data) => {
    return createEquipment(data)
}

const getAll = async () => {
    return getAllEquipments()
}

const getById = async (id) => {
    const equipment = await getEquipmentById(id)
    if (!equipment) {
        throw new ConflictError(`Equipment with id: ${id} not exist`)
    }
    return equipment
}

const update = async (id, data) => {
    const equipment = await getEquipmentById(id)
    if (!equipment) {
        throw new ConflictError(`Equipment with id: ${id} not exist`)
    }

    if (data.categoryId) {
        const equipmentCategory = await getEquipmentCategoryById(
            data.categoryId
        )

        if (!equipmentCategory) {
            throw new ConflictError(
                `Equipment category with id: ${id} not exist`
            )
        }
    }

    return updateEquipment(id, data)
}

export { create, getAll, getById, update }
