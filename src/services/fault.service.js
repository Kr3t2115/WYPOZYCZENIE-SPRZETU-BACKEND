import * as faultRepository from '../repositories/fault.repository.js'
import { ConflictError, NotFoundError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'
import { Role } from '@prisma/client'
import * as rentalRepository from '../repositories/rental.repository.js'

const create = async (data, user) => {
    const rental = await rentalRepository.findById(data.rentalId)

    if (!rental) {
        throw new NotFoundError('Nie znaleziono wypożyczenia')
    }

    if (user.role === Role.STUDENT && rental.studentId !== user.id) {
        throw new ConflictError('To wypożyczenie nie jest twoje')
    }

    let insertedData = {
        rentalId: data.rentalId,
        description: data.description,
        severity: data.severity,
        reportedBy: user.id,
        occurredDuring: data.occurredDuring,
    }

    return faultRepository.insert(insertedData)
}

const update = async (id, data) => {
    const fault = await faultRepository.findById(id)

    if (!fault) {
        throw new NotFoundError('Nie znaleziono szkody')
    }

    return faultRepository.update(id, data)
}

const getById = async (id, user) => {
    const fault = await faultRepository.findById(id)

    if (!fault) {
        throw new NotFoundError('Nie znaleziono szkody')
    }

    if (user.role === Role.STUDENT && fault.reportedBy !== user.id) {
        throw new ConflictError('To szkoda nie została zgłoszona przez Ciebie')
    }

    return fault
}

const getAll = async (filters, pagination, user) => {
    const where = buildWhere(filters, user)

    const [data, total] = await Promise.all([
        faultRepository.findAll(where, pagination),
        faultRepository.count(where),
    ])

    return { data, meta: getPaginationMeta(total, pagination) }
}

const buildWhere = (filters, user) => {
    const where = {}

    if (user.role === Role.STUDENT) {
        where.reportedBy = user.id
    }

    return where
}

export { create, update, getById, getAll }
