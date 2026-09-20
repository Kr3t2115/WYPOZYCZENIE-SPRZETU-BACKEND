import * as reservationService from '../services/reservation.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'

const store = async (req, res, next) => {
    try {
        const newReservation = await reservationService.create(
            req.body,
            req.user
        )
        return res.status(201).json(newReservation)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit, ...filters } = req.query
        const pagination = getPaginationParams(page, limit)

        const reservations = await reservationService.getAll(
            filters,
            pagination,
            req.user
        )

        return res.status(200).json(reservations)
    } catch (err) {
        next(err)
    }
}

const show = async (req, res, next) => {
    try {
        const reservation = await reservationService.getById(
            req.params.id,
            req.user
        )
        return res.status(200).json(reservation)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const updatedReservation = await reservationService.update(
            req.params.id,
            req.body,
            req.user
        )
        return res.status(200).json(updatedReservation)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
