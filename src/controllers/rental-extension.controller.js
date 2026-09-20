import * as rentalExtensionService from '../services/rental-extension.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'

const store = async (req, res, next) => {
    try {
        const newRentalExtension = await rentalExtensionService.create(
            req.body,
            req.user
        )
        return res.status(201).json(newRentalExtension)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit, ...filters } = req.query

        const pagination = getPaginationParams(page, limit)

        const rentalExtensions = await rentalExtensionService.getAll(
            filters,
            pagination,
            req.user
        )

        return res.status(200).json(rentalExtensions)
    } catch (err) {
        next(err)
    }
}

const show = async (req, res, next) => {
    try {
        const rentalExtension = await rentalExtensionService.getById(
            req.params.id,
            req.user
        )
        return res.status(200).json(rentalExtension)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const updatedRentalExtension = await rentalExtensionService.update(
            req.params.id,
            req.body,
            req.user
        )
        return res.status(200).json(updatedRentalExtension)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
