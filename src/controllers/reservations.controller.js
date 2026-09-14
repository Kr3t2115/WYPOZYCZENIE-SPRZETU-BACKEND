import * as reservationService from '../services/reservation.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'
import { createSchema } from '../schemas/reservations.schema.js'

const store = async (req, res, next) => {
    try {
        const validated = createSchema.parse(req.body)

        const reservation = await reservationService.create(validated, req.user)
        return res.status(201).json(reservation)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit, ...filters } = req.query
        const pagination = getPaginationParams(page, limit)

        const equipments = await reservationService.getAll(
            filters,
            pagination,
            req.user
        )

        return res.status(200).json(equipments)
    } catch (err) {
        next(err)
    }
}

const show = async (req, res, next) => {
    try {
        const equipment = await reservationService.getById(
            req.params.id,
            req.user
        )
        return res.status(200).json(equipment)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const equipments = await reservationService.update(
            req.params.id,
            req.body,
            req.user
        )
        return res.status(200).json(equipments)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
