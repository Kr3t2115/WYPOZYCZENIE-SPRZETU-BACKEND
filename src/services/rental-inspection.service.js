import * as rentalInspectionRepository from '../repositories/rental-inspection.repository.js'
import * as rentalRepository from '../repositories/rental.repository.js'
import { ConflictError, NotFoundError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'
import * as faultRepository from '../repositories/fault.repository.js'

const create = async (data, user) => {
    const rental = await rentalRepository.findById(data.rentalId)

    if (!rental) {
        throw new NotFoundError('Nie znaleziono wypożyczenia')
    }

    const uploadToken = crypto.randomBytes(32).toString('hex')
    const uploadTokenExpiry = new Date(Date.now() + 30 * 60 * 1000) // 30 min na wgranie zdjęć

    return rentalInspectionRepository.insert({
        ...data,
        inspectedBy: user.id,
        uploadToken,
        uploadTokenExpiry,
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

const regenerateUploadToken = async (id) => {
    const rentalInspection = await rentalInspectionRepository.findById(id)

    if (!rentalInspection) {
        throw new NotFoundError('Zgłoszenie nie istnieje')
    }

    if (
        rentalInspection.uploadToken &&
        rentalInspection.uploadTokenExpiry &&
        rentalInspection.uploadTokenExpiry > new Date()
    ) {
        throw new ConflictError('Aktualny token nadal jest ważny')
    }

    const uploadToken = crypto.randomBytes(32).toString('hex')
    const uploadTokenExpiry = new Date(Date.now() + 30 * 60 * 1000) // 30 min na wgranie zdjęć

    const updated = await rentalInspectionRepository.update(id, {
        uploadToken,
        uploadTokenExpiry,
    })

    return {
        uploadUrl: `${process.env.FRONTEND_URL}/rental-inspection/${id}/upload?token=${updated.uploadToken}`,
    }
}

export { create, update, getById, getAll, regenerateUploadToken }
