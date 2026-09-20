import * as reservationsRepository from '../repositories/reservations.repository.js'
import * as equipmentRepository from '../repositories/equipment.repository.js'

import { ConflictError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'
import { EquipmentStatus, ReservationStatus, Role } from '@prisma/client'

const create = async (data, student) => {
    const equipment = await equipmentRepository.findById(data.equipmentId)

    if (!equipment) {
        throw new ConflictError(`Taki sprzęt nie istnieje`)
    }

    if (equipment.status !== EquipmentStatus.AVAILABLE) {
        throw new ConflictError(
            'Status sprzętu musi być na AVAILABLE (dostępny)'
        )
    }

    const checkDateConflict =
        await reservationsRepository.findReservationConflict(data)

    if (checkDateConflict) {
        throw new ConflictError('Konflikt dat')
    }

    let insertedData = {}
    insertedData.studentId = student.id
    insertedData.equipmentId = data.equipmentId

    if (data.startDate >= data.endDate) {
        throw new ConflictError('End date is invalid')
    }

    insertedData.startDate = data.startDate
    insertedData.endDate = data.endDate
    insertedData.status = ReservationStatus.PENDING
    insertedData.notes = data.notes ?? null

    return reservationsRepository.insert(insertedData)
}

const update = async (id, data, user) => {
    let updatedData = {}

    const reservation = await reservationsRepository.findById(id)

    switch (user.role) {
        case Role.STUDENT:
            if (reservation.studentId != user.id) {
                throw new ConflictError('Nie można')
            }

            const newStartDate = data.startDate ?? reservation.startDate
            const newEndDate = data.endDate ?? reservation.endDate

            if (newStartDate > newEndDate) {
                throw new ConflictError(
                    'Data zakończenia nie może być wcześniejsza niż data rozpoczęcia'
                )
            }

            const checkDateConfilict =
                await reservationsRepository.findReservationConflict(
                    {
                        equipmentId: data.equipmentId,
                        setDate: newStartDate,
                        endDate: newEndDate,
                    },
                    id
                )

            if (checkDateConfilict) {
                throw new ConflictError(
                    'Nie możesz przedłużyć sprzętu w tym czasie ponieważ ktoś już dokonał rezerwacji '
                )
            }

            if (data.status && ReservationStatus.CANCELLED === data.status) {
                updatedData.status = ReservationStatus.CANCELLED
            }

            updatedData.startDate = newStartDate
            updatedData.endDate = newEndDate

            updatedData.notes = data.notes ?? null
            return reservationsRepository.update(id, updatedData)
        case Role.SECRETARIAT:
        case Role.IT_STAFF:
            const CORRECT_STATUSES = [
                ReservationStatus.APPROVED,
                ReservationStatus.REJECTED,
            ]

            if (data.status && CORRECT_STATUSES.includes(data.status)) {
                updatedData.status = data.status
            }

            updatedData.rejectReason = data.rejectReason ?? null

            return reservationsRepository.update(id, updatedData)
    }
}

const getById = async (id, user) => {
    const reservation = await reservationsRepository.findById(id)

    switch (user.role) {
        case Role.STUDENT:
            if (reservation.studentId !== user.id) {
                throw new ConflictError(
                    'Nie możesz pobrać danych odnośnie tej rezerwacji'
                )
            }
            return reservation
        case Role.SECRETARIAT:
        case Role.IT_STAFF:
            if (!reservation) {
                throw new ConflictError('Taka rezerwacja nie istnieje')
            }
            return reservation
    }
}

const getAll = async (filters, pagination, user) => {
    const where = buildWhere(filters, user)

    const [data, total] = await Promise.all([
        reservationsRepository.findAll(where, pagination),
        reservationsRepository.count(where),
    ])

    return { data, meta: getPaginationMeta(total, pagination) }
}

const buildWhere = (filters, user) => {
    const where = {}

    if (filters.equipmentId) {
        where.equipmentId = filters.equipmentId
    }
    if (filters.status && ReservationStatus.includes(filters.status)) {
        where.status = filters.status
    }
    if (filters.startDate) {
        where.endDate = { gte: filters.startDate }
    }
    if (filters.endDate) {
        where.startDate = { lte: filters.endDate }
    }

    switch (user.role) {
        case Role.STUDENT:
            where.studentId = user.id
            break
        case Role.SECRETARIAT:
        case Role.IT_STAFF:
            if (filters.reviewedBy) {
                where.reviewedBy = filters.reviewedBy
            }

            break
    }

    return where
}

export { create, update, getById, getAll }
