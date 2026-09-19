import * as faultRepository from '../repositories/fault.repository.js'
import { ConflictError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'
import { Role } from '@prisma/client'
import * as rentalRepository from '../repositories/rental.repository.js'

const create = async (data, user) => {
    const rental = await rentalRepository.findById(data.rentalId)

    if (!rental) {
        throw new ConflictError('Fault not found')
    }

    if (user.role === Role.STUDENT && rental.studentId !== user.id) {
        throw new ConflictError('Fault not found')
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
        throw new ConflictError('Fault not found')
    }

    let updatedData = {}

    if (data.status) {
        updatedData.status = data.status
    }

    if (data.resolveNote) {
        updatedData.resolveNote = data.resolveNote
    }

    return faultRepository.update(id, updatedData)
}

const getById = async (id, user) => {
    const fault = await faultRepository.findById(id)

    if (!fault) {
        throw new ConflictError('Fault not found')
    }

    if (user.role === Role.STUDENT && fault.reportedBy !== user.id) {
        throw new ConflictError('Fault not found')
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
