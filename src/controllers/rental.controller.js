import * as rentalService from '../services/rental.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'

const store = async (req, res, next) => {
    try {
        const newRental = await rentalService.create(req.body, req.user)
        return res.status(201).json(newRental)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit, ...filters } = req.query

        const pagination = getPaginationParams(page, limit)

        const rentals = await rentalService.getAll(
            filters,
            pagination,
            req.user
        )

        return res.status(200).json(rentals)
    } catch (err) {
        next(err)
    }
}

const show = async (req, res, next) => {
    try {
        const rental = await rentalService.getById(req.params.id, req.user)
        return res.status(200).json(rental)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const updatedRental = await rentalService.update(
            req.params.id,
            req.body,
            req.user
        )
        return res.status(200).json(updatedRental)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
