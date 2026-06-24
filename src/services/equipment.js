import { createEquipment } from '../repositories/equipment.js'

const create = async (data) => {
    return createEquipment(data)
}

export { create }
