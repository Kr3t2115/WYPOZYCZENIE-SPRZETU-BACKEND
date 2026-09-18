import * as rentalRepository from '../repositories/rental.repository.js'
import * as reservationRepository from '../repositories/reservations.repository.js'
import * as equipmentRepository from '../repositories/equipment.repository.js'

import { ConflictError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'
import { EquipmentStatus, ReservationStatus, Role } from '@prisma/client'
import { RentalCreationMode } from '../schemas/rental.schema.js'

const create = async (data, user) => {
    let insertedData = {
        issuedBy: user.id,
    }

    const currentDate = new Date()

    if (data.mode === RentalCreationMode.FROM_RESERVATION) {
        const reservation = await reservationRepository.findById(
            data.reservationId
        )

        if (!reservation) {
            throw new ConflictError('Reservation not found')
        }

        if (reservation.status !== ReservationStatus.APPROVED) {
            throw new ConflictError('Reservation not found aaa')
        }

        if (reservation.startDate > currentDate) {
            throw new ConflictError(
                'Data rozpoczęcia wypożyczenia musi być w przedziale od dnia rozpoczęcia do zakończenia'
            )
        }

        if (reservation.startDate > reservation.endDate) {
            throw new ConflictError(
                'Data zakończenia nie może być wcześniejsza niż data rozpoczęcia'
            )
        }

        insertedData = {
            ...insertedData,
            studentId: reservation.studentId,
            equipmentId: reservation.equipmentId,
            startDate: reservation.startDate,
            dueDate: reservation.endDate,
            reservationId: reservation.id,
        }

        await reservationRepository.update(reservation.id, {
            status: ReservationStatus.COMPLETED,
        })

        await equipmentRepository.update(reservation.equipmentId, {
            status: EquipmentStatus.RENTED,
        })
    } else if (data.mode === RentalCreationMode.MANUAL) {
        if (data.startDate > currentDate) {
            throw new ConflictError(
                'Data rozpoczęcia wypożyczenia musi być w przedziale od dnia rozpoczęcia do zakończenia'
            )
        }

        const equipment = await equipmentRepository.findById(data.equipmentId)

        if (!equipment) {
            throw new ConflictError('Reservation not found')
        }

        if (equipment.status !== EquipmentStatus.AVAILABLE) {
            throw new ConflictError('Reservation not found')
        }

        const dateValidation =
            await reservationRepository.findReservationConflict({
                equipmentId: data.equipmentId,
                startDate: currentDate,
                endDate: currentDate,
            })

        if (dateValidation) {
            throw new ConflictError('Reservation not found')
        }

        insertedData = {
            ...insertedData,
            studentId: data.studentId,
            equipmentId: data.equipmentId,
            startDate: data.startDate,
            dueDate: data.dueDate,
        }

        await equipmentRepository.update(data.equipmentId, {
            status: EquipmentStatus.RENTED,
        })
    }

    return rentalRepository.insert(insertedData)
}

const update = async (id, data, user) => {
    const rental = await rentalRepository.findById(id)
    let updatedData = {}

    updatedData.receivedBy = user.id

    if (!rental) {
        throw new ConflictError('Rental nie istnieje')
    }

    updatedData = {
        ...data,
        ...updatedData,
    }

    return rentalRepository.update(id, updatedData)
}

const getById = async (id, user) => {
    const rental = await rentalRepository.findById(id)

    if (!rental) {
        throw new ConflictError('Reservation not found')
    }

    if (user.role === Role.STUDENT && rental.studentId !== user.id) {
        throw new ConflictError('Reservation not found')
    }

    return rental
}

const getAll = async (filters, pagination, user) => {
    const where = buildWhere(filters, user)

    const [data, total] = await Promise.all([
        rentalRepository.findAll(where, pagination),
        rentalRepository.count(where),
    ])

    return { data, meta: getPaginationMeta(total, pagination) }
}

const buildWhere = (filters, user) => {
    const where = {}

    if (user.role === Role.STUDENT) {
        where.studentId = user.id
    }

    return where
}

export { create, update, getById, getAll }
