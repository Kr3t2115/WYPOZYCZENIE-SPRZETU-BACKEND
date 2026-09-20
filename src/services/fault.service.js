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

    const uploadToken = crypto.randomBytes(32).toString('hex')
    const uploadTokenExpiry = new Date(Date.now() + 30 * 60 * 1000) // 30 min na wgranie zdjęć

    let insertedData = {
        rentalId: data.rentalId,
        description: data.description,
        severity: data.severity,
        reportedBy: user.id,
        occurredDuring: data.occurredDuring,
        uploadToken,
        uploadTokenExpiry,
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

const regenerateUploadToken = async (id) => {
    const fault = await faultRepository.findById(id)

    if (!fault) {
        throw new NotFoundError('Zgłoszenie nie istnieje')
    }

    if (
        fault.uploadToken &&
        fault.uploadTokenExpiry &&
        fault.uploadTokenExpiry > new Date()
    ) {
        throw new ConflictError('Aktualny token nadal jest ważny')
    }

    const uploadToken = crypto.randomBytes(32).toString('hex')
    const uploadTokenExpiry = new Date(Date.now() + 30 * 60 * 1000) // 30 min na wgranie zdjęć

    const updated = await faultRepository.update(id, {
        uploadToken,
        uploadTokenExpiry,
    })

    return {
        uploadUrl: `${process.env.FRONTEND_URL}/faults/${id}/upload?token=${updated.uploadToken}`,
    }
}

export { create, update, getById, getAll, regenerateUploadToken }
