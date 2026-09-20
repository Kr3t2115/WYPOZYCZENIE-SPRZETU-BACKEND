import * as rentalRepository from '../repositories/reservations.repository.js'
import * as rentalExtensionRepository from '../repositories/rental-extension.repository.js'

import { ConflictError, NotFoundError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'
import { ExtensionStatus, RentalStatus, Role } from '@prisma/client'
import * as reservationRepository from '../repositories/reservations.repository.js'

const create = async (data, student) => {
    const rental = await rentalRepository.findById(data.rentalId)

    if (!rental) {
        throw new NotFoundError('Wypożycznenie nie istnieje')
    }

    if (rental.studentId !== student.id) {
        throw new ConflictError('To wypożyczenie nie należy do Ciebie')
    }

    const ALLOWED_STATUSES = [RentalStatus.ACTIVE, RentalStatus.OVERDUE]

    if (!ALLOWED_STATUSES.includes(rental.status)) {
        throw new ConflictError(
            'Rental musi być aktywny lub przeterminowany aby go przedłużyć'
        )
    }

    const dateValidation =
        await reservationRepository.findReservationDateConflict({
            equipmentId: rental.equipmentId,
            startDate: rental.dueDate,
            endDate: data.newDueDate,
        })

    if (dateValidation) {
        throw new ConflictError('Ktoś inny wtedy rezerwuje sprzęt przepraszamy')
    }

    return rentalExtensionRepository.insert(data)
}

const update = async (id, data, user) => {
    const rentalExtension = await rentalExtensionRepository.findById(id)

    if (!rentalExtension) {
        throw new NotFoundError('Przedłużenie wypożyczenia nie istnieje')
    }

    let updatedData = {
        reviewedBy: user.id,
    }

    if (!rentalExtension.reviewedAt) {
        updatedData.reviewedAt = new Date()
    }

    if (data.status === ExtensionStatus.PENDING) {
        throw new ConflictError(
            'Nie można zmienić statusu na PENDING (nierozstrzygnięte)'
        )
    }

    if (data.rejectReason) {
        updatedData.rejectReason = data.rejectReason
    }

    return rentalExtensionRepository.update(id, updatedData)
}

const getById = async (id, user) => {
    const rentalExtension = await rentalExtensionRepository.findById(id)

    if (!rentalExtension) {
        throw new ConflictError('Przedłużenie wypożyczenia nie istnieje')
    }

    const rental = await rentalRepository.findById(rentalExtension.rentalId)

    if (user.role === Role.STUDENT && rental.studentId !== user.id) {
        throw new ConflictError('Nie możesz pobrać danych o tym przedłużeniu')
    }
}

const getAll = async (filters, pagination, user) => {
    const where = buildWhere(filters, user)

    const [data, total] = await Promise.all([
        rentalExtensionRepository.findAll(where, pagination),
        rentalExtensionRepository.count(where),
    ])

    return { data, meta: getPaginationMeta(total, pagination) }
}

const buildWhere = (filters, user) => {
    const where = {}

    if (user.role === Role.STUDENT) {
        where.rental = { studentId: user.id }
    } else if (filters.studentId) {
        where.rental = { studentId: filters.studentId }
    }

    return where
}

export { create, update, getById, getAll }
