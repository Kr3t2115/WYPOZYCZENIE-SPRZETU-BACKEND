import * as rentalInspectionRepository from '../repositories/rental-inspection.repository.js'
import * as rentalRepository from '../repositories/rental.repository.js'
import { NotFoundError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'

const create = async (data, user) => {
    const rental = await rentalRepository.findById(data.rentalId)

    if (!rental) {
        throw new NotFoundError('Nie znaleziono wypożyczenia')
    }

    return rentalInspectionRepository.insert({
        ...data,
        inspectedBy: user.id,
    })
}

const update = async (id, data) => {
    const rentalInspection = await rentalInspectionRepository.findById(id)

    if (!rentalInspection) {
        throw new NotFoundError('Nie znaleziono inspekcji wypożyczenia')
    }

    return rentalInspectionRepository.update(id, {
        notes: data.notes,
    })
}

const getById = async (id, user) => {
    const rentalInspection = await rentalInspectionRepository.findById(id)

    if (!rentalInspection) {
        throw new NotFoundError('Nie znaleziono inspekcji wypożyczenia')
    }

    return rentalInspection
}

const getAll = async (filters, pagination) => {
    const where = buildWhere(filters)

    const [data, total] = await Promise.all([
        rentalInspectionRepository.findAll(where, pagination),
        rentalInspectionRepository.count(where),
    ])

    return { data, meta: getPaginationMeta(total, pagination) }
}

const buildWhere = (filters) => {
    const where = {}

    return where
}

export { create, update, getById, getAll }
