import * as rentalService from '../services/rental.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'
import {
    createSchema,
    getSchema,
    updateSchema,
} from '../schemas/rental.schema.js'

const store = async (req, res, next) => {
    try {
        const validated = createSchema.parse(req.body)

        const reservation = await rentalService.create(validated, req.user)
        return res.status(201).json(reservation)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit } = req.query

        const filters = getSchema.parse(req.query)

        const pagination = getPaginationParams(page, limit)

        const equipments = await rentalService.getAll(
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
        const equipment = await rentalService.getById(req.params.id, req.user)
        return res.status(200).json(equipment)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const data = updateSchema.parse(req.body)

        const equipments = await rentalService.update(
            req.params.id,
            data,
            req.user
        )
        return res.status(200).json(equipments)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
