import * as equipmentRepository from '../repositories/equipment.repository.js'
import { ConflictError } from '../utils/errors.js'
import * as categoryRepository from '../repositories/category.repository.js'

const create = async (data) => {
    const equipmentCategory = await categoryRepository.findById(data.categoryId)

    if (!equipmentCategory) {
        throw new ConflictError(`Equipment category with id: ${id} not exist`)
    }

    return equipmentRepository.insert(data)
}

const getAll = async () => {
    return equipmentRepository.findAll()
}

const getById = async (id) => {
    const equipment = await equipmentRepository.findById(id)
    if (!equipment) {
        throw new ConflictError(`Equipment with id: ${id} not exist`)
    }
    return equipment
}

const update = async (id, data) => {
    const equipment = await equipmentRepository.findById(id)
    if (!equipment) {
        throw new ConflictError(`Equipment with id: ${id} not exist`)
    }

    if (data.categoryId) {
        const equipmentCategory = await categoryRepository.findById(
            data.categoryId
        )

        if (!equipmentCategory) {
            throw new ConflictError(
                `Equipment category with id: ${id} not exist`
            )
        }
    }

    return equipmentRepository.update(id, data)
}

export { create, getAll, getById, update }
